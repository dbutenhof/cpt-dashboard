import PropType from "prop-types";
import { uid } from "@/utils/helper";
import { useSelector } from "react-redux";
import { Table, Tbody, Th, Thead, Tr, Td } from "@patternfly/react-table";
import { Title } from "@patternfly/react-core";

const ILabSummary = (props) => {
  const { item } = props;
  const { isSummaryLoading, summaryData } = useSelector((state) => state.ilab);

  const getSummaryData = (id) => {
    const data = summaryData?.find((a) => a.uid === id);
    return data;
  };
  const hasSummaryData = (id) => {
    const hasData = Boolean(getSummaryData(id) !== undefined);
    return hasData;
  };

  return (
    <>
      {hasSummaryData(item.id) ? (
        <>
          <Table className="box" key={uid()} aria-label="summary-table">
            <Thead>
              <Tr>
                <Th width={20} style={{ textAlign: "left" }}>
                  Metric
                </Th>
                <Th width={20}>Min</Th>
                <Th width={20}>Average</Th>
                <Th width={20}>Max</Th>
              </Tr>
            </Thead>
            <Tbody>
              {getSummaryData(item.id).data.map((stat) => (
                <Tr key={uid()}>
                  <Td>{stat.metric}</Td>
                  <Td>{stat.min}</Td>
                  <Td>{stat.avg}</Td>
                  <Td>{stat.max}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </>
      ) : isSummaryLoading && !hasSummaryData(item.id) ? (
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
