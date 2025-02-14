import React from "react";
import {
  ExpandableRowContent,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchJiraIssues } from "@/actions/ilabActions";
import { formatDateTime, uid } from "@/utils/helper";

export const JiraPanel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchJiraIssues());
  }, [dispatch, navigate]);

  const { jira } = useSelector((state) => state.ilab);
  const [expandedResult, setExpandedResult] = useState([]);

  const isResultExpanded = (res) => expandedResult?.includes(res);
  const setExpanded = async (item, isExpanding = true) => {
    setExpandedResult((prevExpanded) => {
      const otherExpandedRunNames = prevExpanded?.filter(
        (r) => r !== item.name
      );
      return isExpanding
        ? [...otherExpandedRunNames, item.name]
        : otherExpandedRunNames;
    });
  };

  return (
    <Table isStriped={true} variant="compact">
      <Thead>
        <Tr key={uid()}>
          <Th screenReaderText="Row expansion" />
          <Th>Issue</Th>
          <Th>Type</Th>
          <Th>Created</Th>
          <Th>Reporter</Th>
          <Th>Status</Th>
          <Th>Summary</Th>
        </Tr>
      </Thead>
      <Tbody>
        {jira?.length > 0 ? (
          jira.map((item, rowIndex) => (
            <>
              <Tr key={item.name}>
                <Td
                  expand={{
                    rowIndex,
                    isExpanded: isResultExpanded(item.name),
                    onToggle: () =>
                      setExpanded(item, !isResultExpanded(item.name)),
                    expandId: `expandId-${item.name}`,
                  }}
                />
                <Td>
                  <Link to={item.url}>{item.name}</Link>
                </Td>
                <Td>{item.type}</Td>
                <Td>{formatDateTime(item.created)}</Td>
                <Td>
                  <Link to={`mailto:${item.reporter.email}`}>
                    {item.reporter.display}
                  </Link>
                </Td>
                <Td>{item.status}</Td>
                <Td>{item.summary}</Td>
              </Tr>
              <Tr key={uid()} isExpanded={isResultExpanded(item.name)}>
                <Td colSpan={8}>
                  <ExpandableRowContent>
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {item.description}
                    </Markdown>
                  </ExpandableRowContent>
                </Td>
              </Tr>
            </>
          ))
        ) : (
          <></>
        )}
      </Tbody>
    </Table>
  );
};
export default JiraPanel;
