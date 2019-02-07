/** @jsx jsx */
import ContentWrapper from 'gatsby-theme-apollo/src/components/content-wrapper';
import FlexWrapper from 'gatsby-theme-apollo/src/components/flex-wrapper';
import Helmet from 'react-helmet';
import Layout from 'gatsby-theme-apollo/src/components/layout';
import LogoTitle from 'gatsby-theme-apollo/src/components/logo-title';
import PropTypes from 'prop-types';
import Sidebar from 'gatsby-theme-apollo/src/components/sidebar';
import SidebarNav from 'gatsby-theme-apollo/src/components/sidebar-nav';
import colors from 'gatsby-theme-apollo/src/util/colors';
import styled from '@emotion/styled';
import {ReactComponent as AgilityIcon} from '../assets/icons/agility.svg';
import {ReactComponent as IntegrityIcon} from '../assets/icons/integrity.svg';
import {Link, graphql} from 'gatsby';
import {MdChevronLeft, MdChevronRight} from 'react-icons/md';
import {ReactComponent as OperationsIcon} from '../assets/icons/operations.svg';
import {css, jsx} from '@emotion/core';
import {size} from 'polished';

const OuterContentWrapper = styled.div({
  flexGrow: 1,
  overflow: 'auto'
});

const Content = styled.div({
  maxWidth: 800
});

const MainHeading = styled.h1({
  display: 'flex',
  alignItems: 'center'
});

const Markdown = styled.div({
  '.anchor': {
    color: 'inherit',
    svg: {
      fill: 'currentColor'
    }
  }
});

const iconStyles = css(size(65), {
  marginRight: 18,
  borderRadius: '50%',
  fill: 'currentColor'
});

const PageNav = styled.nav({
  display: 'flex',
  padding: '64px 0'
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

const Footer = styled.footer({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 48,
  fontSize: 14,
  color: colors.text1,
  backgroundColor: colors.background
});

const Colophon = styled.span({
  margin: '20px 0'
});

const FooterNav = styled.nav({
  a: {
    margin: '0 12px',
    color: 'inherit',
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline'
    }
  }
});

const Divider = styled.hr({
  width: 400
});

const anchorPattern = /<a href="([\w/#-]+)">([\w\s.,-]+)<\/a>/gm;
const iconComponents = {
  '/integrity': IntegrityIcon,
  '/agility': AgilityIcon,
  '/operations': OperationsIcon
};

export default function Page(props) {
  // set up a base sidebar config with the overview page at the root
  const sidebarConfig = {
    null: [
      {
        path: '/',
        title: 'Overview'
      }
    ]
  };

  // loop through all the pages and construct a sidebar nav based on each
  // page's generated table of contents
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

  // determine current page's place in the order
  const {title, path, color} = props.data.markdownRemark.frontmatter;
  const pageIndex = props.data.allMarkdownRemark.edges.findIndex(
    ({node}) => node.frontmatter.path === path
  );

  // define next and previous pages
  const previousPage = props.data.allMarkdownRemark.edges[pageIndex - 1];
  const nextPage = props.data.allMarkdownRemark.edges[pageIndex + 1];

  const Icon = iconComponents[path];

  return (
    <Layout>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <FlexWrapper>
        <Sidebar title={props.data.site.siteMetadata.title}>
          <SidebarNav
            alwaysExpanded
            contents={sidebarConfig}
            pathname={props.location.pathname}
          />
        </Sidebar>
        <OuterContentWrapper>
          <ContentWrapper>
            <Content>
              <MainHeading>
                {Icon && (
                  <Icon css={iconStyles} style={{backgroundColor: color}} />
                )}
                {title}
              </MainHeading>
              <hr />
              <Markdown
                dangerouslySetInnerHTML={{
                  __html: props.data.markdownRemark.html
                }}
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
          </ContentWrapper>
          <Footer>
            <LogoTitle />
            <Colophon>Written by Geoff Schmidt</Colophon>
            <Divider />
            <FooterNav>
              <a href="https://github.com/apollographql/principled-graphql">
                View source code
              </a>{' '}
              | <a href="https://apollographql.com">ApolloGraphQL.com</a> |{' '}
              <a href="https://summit.graphql.com">GraphQL Summit</a>
            </FooterNav>
          </Footer>
        </OuterContentWrapper>
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
        color
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
