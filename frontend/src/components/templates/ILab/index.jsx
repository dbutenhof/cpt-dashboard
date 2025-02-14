import "./index.less";

import {
  ExpandableRowContent,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";
import {
  fetchIlabFilters,
  fetchILabJobs,
  fetchJiraIssues,
  fetchGraphData,
  fetchMetricsInfo,
  fetchPeriods,
  fetchSummaryData,
  setIlabDateFilter,
  toggleComparisonSwitch,
  updateFromURL,
  updateURL,
} from "@/actions/ilabActions";
import { formatDateTime, uid } from "@/utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import IlabCompareComponent from "./IlabCompareComponent";
import IlabRowContent from "./IlabExpandedRow";
import RenderPagination from "@/components/organisms/Pagination";
import StatusCell from "./StatusCell";
import TableFilter from "@/components/organisms/TableFilters";
import JiraPanel from "./JiraBoard";
import { Button, Modal } from "@patternfly/react-core";

const ILab = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    start_date,
    end_date,
    comparisonSwitch,
    tableData,
    page,
    perPage,
    totalItems,
  } = useSelector((state) => state.ilab);
  const [expandedResult, setExpandedResult] = useState([]);
  const isResultExpanded = (res) => expandedResult?.includes(res);
  const setExpanded = async (run, isExpanding = true) => {
    setExpandedResult((prevExpanded) => {
      const otherExpandedRunNames = prevExpanded.filter((r) => r !== run.id);
      return isExpanding
        ? [...otherExpandedRunNames, run.id]
        : otherExpandedRunNames;
    });
    if (isExpanding) {
      await Promise.all([
        await dispatch(fetchPeriods(run.id)),
        await dispatch(fetchMetricsInfo(run.id)),
        await dispatch(fetchGraphData(run.id)),
        await dispatch(fetchSummaryData(run.id)),
      ]);
    }
  };
  const [isJiraOpen, setIsJiraOpen] = useState(false);

  const toggleJira = () => {
    setIsJiraOpen(!isJiraOpen);
    if (isJiraOpen) {
      dispatch(fetchJiraIssues());
    }
  };

  useEffect(() => {
    dispatch(fetchIlabFilters());
    if (searchParams.size > 0) {
      // date filter is set apart
      const startDate = searchParams.get("start_date");
      const endDate = searchParams.get("end_date");

      searchParams.delete("start_date");
      searchParams.delete("end_date");
      const params = Object.fromEntries(searchParams);
      const obj = {};
      for (const key in params) {
        obj[key] = params[key].split(",");
      }
      if (startDate || endDate) {
        dispatch(setIlabDateFilter(startDate, endDate, navigate));
      }

      dispatch(updateFromURL(obj));
    } else {
      dispatch(updateURL(navigate));
    }
  }, []);

  useEffect(() => {
    dispatch(fetchILabJobs());
  }, [dispatch, navigate]);

  const columnNames = {
    benchmark: "Benchmark",
    email: "Email",
    name: "Name",
    source: "Source",
    metric: "Metric",
    begin_date: "Start Date",
    end_date: "End Date",
    status: "Status",
  };

  const onSwitchChange = () => {
    dispatch(toggleComparisonSwitch());
    dispatch(updateURL(navigate));
  };
  return (
    <>
      <TableFilter
        start_date={start_date}
        end_date={end_date}
        type={"ilab"}
        showColumnMenu={false}
        navigation={navigate}
        isSwitchChecked={comparisonSwitch}
        onSwitchChange={onSwitchChange}
      />
      <Button onClick={toggleJira} ouiaId="JiraModal">
        Show Jira
      </Button>
      <Modal
        isOpen={isJiraOpen}
        onClose={toggleJira}
        width="60%"
        ouiaId="JiraModal"
        title="Jira issues"
      >
        <JiraPanel />
      </Modal>
      {comparisonSwitch ? (
        <IlabCompareComponent />
      ) : (
        <>
          <Table aria-label="Misc table" isStriped variant="compact">
            <Thead>
              <Tr key={uid()}>
                <Th screenReaderText="Row expansion" />
                <Th>{columnNames.metric}</Th>
                <Th>{columnNames.begin_date}</Th>
                <Th>{columnNames.end_date}</Th>
                <Th>{columnNames.status}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tableData.map((item, rowIndex) => (
                <>
                  <Tr key={uid()}>
                    <Td
                      expand={{
                        rowIndex,
                        isExpanded: isResultExpanded(item.id),
                        onToggle: () =>
                          setExpanded(item, !isResultExpanded(item.id)),
                        expandId: `expandId-${uid()}`,
                      }}
                    />

                    <Td>{item.primary_metrics[0]}</Td>
                    <Th>{formatDateTime(item.begin_date)}</Th>
                    <Th>{formatDateTime(item.end_date)}</Th>
                    <Td>
                      <StatusCell value={item.status} />
                    </Td>
                  </Tr>
                  <Tr key={uid()} isExpanded={isResultExpanded(item.id)}>
                    <Td colSpan={8}>
                      <ExpandableRowContent>
                        <IlabRowContent item={item} />
                      </ExpandableRowContent>
                    </Td>
                  </Tr>
                </>
              ))}
            </Tbody>
          </Table>
          <RenderPagination
            items={totalItems}
            page={page}
            perPage={perPage}
            type={"ilab"}
          />
        </>
      )}
    </>
  );
};

export default ILab;
