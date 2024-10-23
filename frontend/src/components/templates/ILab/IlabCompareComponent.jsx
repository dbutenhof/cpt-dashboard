import "./index.less";

import {
  Button,
  Flex,
  FlexItem,
  Menu,
  MenuContent,
  MenuItem,
  MenuItemAction,
  MenuList,
  Title,
} from "@patternfly/react-core";
import { useDispatch, useSelector } from "react-redux";

import { InfoCircleIcon } from "@patternfly/react-icons";
import Plot from "react-plotly.js";
import PropTypes from "prop-types";
import RenderPagination from "@/components/organisms/Pagination";
import { cloneDeep } from "lodash";
import { handleMultiGraph, handleSummaryData } from "@/actions/ilabActions.js";
import { uid } from "@/utils/helper";
import { useState } from "react";
import ILabSummary from "./ILabSummary";

const IlabCompareComponent = () => {
  // const { data } = props;
  const { page, perPage, totalItems, tableData } = useSelector(
    (state) => state.ilab
  );
  const dispatch = useDispatch();
  const [selectedItems, setSelectedItems] = useState([]);
  const { multiGraphData, summaryData, isSummaryLoading } = useSelector(
    (state) => state.ilab
  );
  const isGraphLoading = useSelector((state) => state.loading.isGraphLoading);
  const graphDataCopy = cloneDeep(multiGraphData);

  const onSelect = (_event, itemId) => {
    const item = itemId;
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((id) => id !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };
  const dummy = async () => {
    await dispatch(handleSummaryData(selectedItems));
    await dispatch(handleMultiGraph(selectedItems));
  };
  return (
    <div className="comparison-container">
      <div className="metrics-container">
        <Title headingLevel="h3" className="title">
          Metrics
        </Title>
        <Button
          className="compare-btn"
          isDisabled={selectedItems.length < 2}
          isBlock
          onClick={dummy}
        >
          Compare
        </Button>
        <Menu onSelect={onSelect} selected={selectedItems}>
          <MenuContent>
            <MenuList>
              {tableData.map((item) => {
                return (
                  <MenuItem
                    key={uid()}
                    hasCheckbox
                    itemId={item.id}
                    isSelected={selectedItems.includes(item.id)}
                    actions={
                      <MenuItemAction
                        icon={<InfoCircleIcon aria-hidden />}
                        actionId="code"
                        onClick={() => console.log("clicked on code icon")}
                        aria-label="Code"
                      />
                    }
                  >
                    {`${new Date(item.begin_date).toLocaleDateString()} ${
                      item.primary_metrics[0]
                    }`}
                  </MenuItem>
                );
              })}
            </MenuList>
          </MenuContent>
        </Menu>
        <RenderPagination
          items={totalItems}
          page={page}
          perPage={perPage}
          type={"ilab"}
        />
      </div>
      <Flex>
        <FlexItem span={12} className="summary-box">
          {isSummaryLoading ? (
            <div className="loader"></div>
          ) : summaryData.filter((i) => selectedItems.includes(i.uid)).length ==
            selectedItems.length ? (
            <ILabSummary ids={selectedItems} />
          ) : (
            <div>No data to summarize</div>
          )}
        </FlexItem>
        <FlexItem span={12} className="chart-box">
          {isGraphLoading ? (
            <div className="loader"></div>
          ) : graphDataCopy?.length > 0 &&
            graphDataCopy?.[0]?.data?.length > 0 ? (
            <Plot
              data={graphDataCopy[0]?.data}
              layout={graphDataCopy[0]?.layout}
              key={uid()}
            />
          ) : (
            <div>No data to compare</div>
          )}
        </FlexItem>
      </Flex>
    </div>
  );
};

IlabCompareComponent.propTypes = {
  data: PropTypes.array,
};
export default IlabCompareComponent;
