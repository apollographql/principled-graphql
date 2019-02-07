import ContentWrapper from 'gatsby-theme-apollo/src/components/content-wrapper';
import FlexWrapper from 'gatsby-theme-apollo/src/components/flex-wrapper';
import Layout from 'gatsby-theme-apollo/src/components/layout';
import PropTypes from 'prop-types';
import React from 'react';
import Sidebar from 'gatsby-theme-apollo/src/components/sidebar';
import SidebarNav from 'gatsby-theme-apollo/src/components/sidebar-nav';
import colors from 'gatsby-theme-apollo/src/util/colors';
import styled from '@emotion/styled';
import {Link, graphql} from 'gatsby';
import {MdChevronLeft, MdChevronRight} from 'react-icons/md';
import {size} from 'polished';

const StyledContentWrapper = styled(ContentWrapper)({
  flexGrow: 1,
  overflow: 'auto'
});

const Content = styled.div({
  maxWidth: 800
});

const PageNav = styled.nav({
  display: 'flex',
  padding: '24px 0'
});

const PageNavLink = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  color: 'inherit',
  textDecoration: 'none',
  svg: size(20)
});

const PageNavLinkText = styled.div(({align = 'left'}) => ({
  [`margin${align.charAt(0).toUpperCase() + align.slice(1)}`]: 24,
  textAlign: align
}));

const PageNavLinkHeading = styled.div({
  fontSize: 12,
  letterSpacing: 2,
  textTransform: 'uppercase'
});

const PageNavLinkTitle = styled.div({
  color: colors.text1
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
        title: match[2]
      });
    }

    sidebarConfig[node.frontmatter.title] = matches;
  });

  const pageIndex = props.data.allMarkdownRemark.edges.findIndex(
    ({node}) =>
      node.frontmatter.path === props.data.markdownRemark.frontmatter.path
  );

  const previousPage = props.data.allMarkdownRemark.edges[pageIndex - 1];
  const nextPage = props.data.allMarkdownRemark.edges[pageIndex + 1];

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
          <Content>
            <h1>{props.data.markdownRemark.frontmatter.title}</h1>
            <hr />
            <div
              dangerouslySetInnerHTML={{__html: props.data.markdownRemark.html}}
            />
            <PageNav>
              {previousPage && (
                <PageNavLink to={previousPage.node.frontmatter.path}>
                  <MdChevronLeft />
                  <PageNavLinkText>
                    <PageNavLinkHeading>Previous</PageNavLinkHeading>
                    <PageNavLinkTitle>
                      {previousPage.node.frontmatter.title}
                    </PageNavLinkTitle>
                  </PageNavLinkText>
                </PageNavLink>
              )}
              {nextPage && (
                <PageNavLink
                  to={nextPage.node.frontmatter.path}
                  style={{marginLeft: 'auto'}}
                >
                  <PageNavLinkText align="right">
                    <PageNavLinkHeading>Next</PageNavLinkHeading>
                    <PageNavLinkTitle>
                      {nextPage.node.frontmatter.title}
                    </PageNavLinkTitle>
                  </PageNavLinkText>
                  <MdChevronRight />
                </PageNavLink>
              )}
            </PageNav>
          </Content>
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
