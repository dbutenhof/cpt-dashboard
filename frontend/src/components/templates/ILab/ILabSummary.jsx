import PropType from "prop-types";
import { uid } from "@/utils/helper";
import { useSelector } from "react-redux";
import { Table, Tbody, Th, Thead, Tr } from "@patternfly/react-table";
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
        getSummaryData(item.id).data.map((stat) => (
          <>
            <Title key={uid()} headingLevel="h4" className="type_heading">
              {`Metric ${stat.metric}`}
            </Title>
            <Table className="box" key={uid()} aria-label="summary-table">
              <Thead>
                <Tr>
                  <Th width={20} style={{ textAlign: "left" }}>
                    Key
                  </Th>
                  <Th width={20}>Value</Th>
                </Tr>
              </Thead>
              <Tbody>
                {["count", "min", "max", "avg", "sum"].map((f) => (
                  <Tr key={uid()}>
                    <Th>{f}</Th>
                    <Th>{stat[f]}</Th>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </>
        ))
      ) : isSummaryLoading && !hasSummaryData(item.id) ? (
        <div className="loader"></div>
      ) : (
        <>"Nothing to load"</>
      )}
    </>
  );
};

ILabSummary.propTypes = {
  item: PropType.object,
};
export default ILabSummary;
