import PropType from "prop-types";
import { uid } from "@/utils/helper";
import { useSelector } from "react-redux";
import {
  Caption,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  Td,
} from "@patternfly/react-table";

const ILabSummary = (props) => {
  const { ids } = props;
  const { isSummaryLoading, summaryData } = useSelector((state) => state.ilab);

  const getSummaryData = (id) => {
    const data = summaryData?.find((a) => a.uid === id);
    return data;
  };
  const hasSummaryData = (ids) => {
    const hasData = Boolean(
      summaryData.filter((i) => ids.includes(i.uid)).length === ids.length
    );
    return hasData;
  };

  return (
    <>
      {hasSummaryData(ids) ? (
        <>
          <Table
            variant={"compact"}
            hasNoInset
            className="box"
            key={uid()}
            aria-label="summary-table"
            isStriped
          >
            <Thead>
              <Tr>
                {ids.length > 1 ? <Th>Run</Th> : <></>}
                <Th>Metric</Th>
                <Th>Min</Th>
                <Th>Average</Th>
                <Th>Max</Th>
              </Tr>
            </Thead>
            <Tbody>
              {ids.map((id, idx) =>
                getSummaryData(id).data.map((stat) => (
                  <Tr key={uid()}>
                    {ids.length > 1 ? <Td>{idx + 1}</Td> : <></>}
                    <Td>{stat.title}</Td>
                    <Td>{stat.min.toPrecision(6)}</Td>
                    <Td>{stat.avg.toPrecision(6)}</Td>
                    <Td>{stat.max.toPrecision(6)}</Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </>
      ) : isSummaryLoading && !hasSummaryData(ids) ? (
        <div className="loader"></div>
      ) : (
        <></>
      )}
    </>
  );
};

ILabSummary.propTypes = {
  item: PropType.object,
};
export default ILabSummary;
