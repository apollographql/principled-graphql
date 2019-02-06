import ContentWrapper from 'gatsby-theme-apollo/src/components/content-wrapper';
import FlexWrapper from 'gatsby-theme-apollo/src/components/flex-wrapper';
import Layout from 'gatsby-theme-apollo/src/components/layout';
import PropTypes from 'prop-types';
import React from 'react';
import Sidebar from 'gatsby-theme-apollo/src/components/sidebar';
import SidebarNav from 'gatsby-theme-apollo/src/components/sidebar-nav';
import styled from '@emotion/styled';
import {graphql} from 'gatsby';

const StyledContentWrapper = styled(ContentWrapper)({
  flexGrow: 1,
  overflow: 'auto'
});

const Content = styled.div({
  maxWidth: 800
});

const anchorPattern = /<a href="([\w/#-]+)">([\w\s.,-]+)<\/a>/gm;
export default function Page(props) {
  const sidebarConfig = {
    null: [
      {
        path: '/',
        title: 'Overview'
      }
    ]
  };

  props.data.allMarkdownRemark.edges.forEach(({node}) => {
    if (!node.tableOfContents) {
      return;
    }

    let match;
    const matches = [];
    while ((match = anchorPattern.exec(node.tableOfContents)) !== null) {
      matches.push({
        path: match[1],
        title: match[2],
        link: true
      });
    }

    sidebarConfig[node.frontmatter.title] = matches;
  });

  return (
    <Layout>
      <FlexWrapper>
        <Sidebar title={props.data.site.siteMetadata.title}>
          <SidebarNav
            alwaysExpanded
            contents={sidebarConfig}
            pathname={props.location.pathname}
          />
        </Sidebar>
        <StyledContentWrapper>
          <Content
            dangerouslySetInnerHTML={{__html: props.data.markdownRemark.html}}
          />
        </StyledContentWrapper>
      </FlexWrapper>
    </Layout>
  );
}

Page.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: {path: {eq: $path}}) {
      html
      frontmatter {
        path
        title
      }
    }

    allMarkdownRemark(sort: {order: ASC, fields: [frontmatter___order]}) {
      edges {
        node {
          tableOfContents(pathToSlugField: "frontmatter.path", maxDepth: 2)
          headings {
            depth
            value
          }
          frontmatter {
            path
            title
          }
        }
      }
    }

    site {
      siteMetadata {
        title
      }
    }
  }
`;
