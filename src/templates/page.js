import ContentWrapper from 'gatsby-theme-apollo/src/components/content-wrapper';
import FlexWrapper from 'gatsby-theme-apollo/src/components/flex-wrapper';
import Header from 'gatsby-theme-apollo/src/components/header';
import Helmet from 'react-helmet';
import Layout from 'gatsby-theme-apollo/src/components/layout';
import LogoTitle from 'gatsby-theme-apollo/src/components/logo-title';
import PropTypes from 'prop-types';
import React, {Component, createRef} from 'react';
import Sidebar from 'gatsby-theme-apollo/src/components/sidebar';
import SidebarNav from 'gatsby-theme-apollo/src/components/sidebar-nav';
import colors from 'gatsby-theme-apollo/src/util/colors';
import styled from '@emotion/styled';
import {ReactComponent as AgilityIcon} from '../assets/icons/agility.svg';
import {ReactComponent as IntegrityIcon} from '../assets/icons/integrity.svg';
import {Link, graphql} from 'gatsby';
import {MdChevronLeft, MdChevronRight, MdMenu} from 'react-icons/md';
import {ReactComponent as OperationsIcon} from '../assets/icons/operations.svg';
import {breakpointMd} from 'gatsby-theme-apollo/src/util/breakpoints';
import {css} from '@emotion/core';
import {findDOMNode} from 'react-dom';
import {size} from 'polished';

const OuterContentWrapper = styled.div({
  flexGrow: 1,
  overflow: 'auto'
});

const Content = styled.div({
  maxWidth: 800
});

const MobileHeader = styled(Header)({
  display: 'none',
  [breakpointMd]: {
    display: 'flex'
  }
});

const MenuButton = styled.button({
  padding: 0,
  marginRight: 20,
  color: 'inherit',
  border: 'none',
  background: 'none',
  outline: 'none',
  cursor: 'pointer',
  svg: css(size(24), {
    display: 'block',
    fill: 'currentColor'
  })
});

const MainHeading = styled.h1({
  display: 'flex',
  alignItems: 'center',
  svg: css(size(65), {
    marginRight: 18,
    borderRadius: '50%',
    fill: 'currentColor'
  })
});

const Markdown = styled.div({
  '.anchor': {
    color: 'inherit',
    svg: {
      fill: 'currentColor'
    }
  }
});

const PageNav = styled.nav({
  display: 'flex',
  padding: '64px 0',
  [breakpointMd]: {
    padding: '32px 0'
  }
});

const PageNavLink = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  color: 'inherit',
  textDecoration: 'none',
  svg: size(20)
});

const PageNavLinkText = styled.div(({align = 'left'}) => {
  const marginProperty = `margin${align.charAt(0).toUpperCase() +
    align.slice(1)}`;
  return {
    [marginProperty]: 24,
    textAlign: align,
    [breakpointMd]: {
      [marginProperty]: 16
    }
  };
});

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
  textAlign: 'center',
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
  width: '100%',
  maxWidth: 400
});

const anchorPattern = /<a href="([\w/#-]+)">([\w\s.,-]+)<\/a>/gm;
const iconComponents = {
  '/integrity': IntegrityIcon,
  '/agility': AgilityIcon,
  '/operations': OperationsIcon
};

export default class Page extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  state = {
    sidebarOpen: false
  };

  sidebar = createRef();

  onKeyDown = event => {
    // close the sidebar when esc key is pressed
    if (this.state.sidebarOpen && event.keyCode === 27) {
      this.closeSidebar();
    }
  };

  onWrapperClick = event => {
    if (
      this.state.sidebarOpen &&
      // eslint-disable-next-line react/no-find-dom-node
      !findDOMNode(this.sidebar.current).contains(event.target)
    ) {
      this.closeSidebar();
    }
  };

  openSidebar = () => this.setState({sidebarOpen: true});

  closeSidebar = () => this.setState({sidebarOpen: false});

  render() {
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
    this.props.data.allMarkdownRemark.edges.forEach(({node}) => {
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
    const {title, path, color} = this.props.data.markdownRemark.frontmatter;
    const pageIndex = this.props.data.allMarkdownRemark.edges.findIndex(
      ({node}) => node.frontmatter.path === path
    );

    // define next and previous pages
    const previousPage = this.props.data.allMarkdownRemark.edges[pageIndex - 1];
    const nextPage = this.props.data.allMarkdownRemark.edges[pageIndex + 1];

    // find an icon for the current path
    const Icon = iconComponents[path];

    return (
      <Layout>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <FlexWrapper onClick={this.onWrapperClick}>
          <Sidebar
            ref={this.sidebar}
            open={this.state.sidebarOpen}
            title={this.props.data.site.siteMetadata.title}
          >
            <SidebarNav
              alwaysExpanded
              contents={sidebarConfig}
              pathname={this.props.location.pathname}
            />
          </Sidebar>
          <OuterContentWrapper>
            <MobileHeader>
              <MenuButton onClick={this.openSidebar}>
                <MdMenu />
              </MenuButton>
              <LogoTitle />
            </MobileHeader>
            <ContentWrapper>
              <Content>
                <MainHeading>
                  {Icon && <Icon style={{backgroundColor: color}} />}
                  {title}
                </MainHeading>
                <hr />
                <Markdown
                  dangerouslySetInnerHTML={{
                    __html: this.props.data.markdownRemark.html
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
}

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
