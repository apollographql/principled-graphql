import ContentWrapper from 'gatsby-theme-apollo/src/components/content-wrapper';
import FlexWrapper from 'gatsby-theme-apollo/src/components/flex-wrapper';
import Header from 'gatsby-theme-apollo/src/components/header';
import Helmet from 'react-helmet';
import Layout from 'gatsby-theme-apollo/src/components/layout';
import LogoTitle from 'gatsby-theme-apollo/src/components/logo-title';
import PropTypes from 'prop-types';
import React, {Component, Fragment, createRef} from 'react';
import Sidebar from 'gatsby-theme-apollo/src/components/sidebar';
import SidebarNav from 'gatsby-theme-apollo/src/components/sidebar-nav';
import colors from 'gatsby-theme-apollo/src/util/colors';
import styled from '@emotion/styled';
import {Link, graphql} from 'gatsby';
import {MdChevronLeft, MdChevronRight, MdMenu} from 'react-icons/md';
import {
  breakpointMd,
  breakpointSm
} from 'gatsby-theme-apollo/src/util/breakpoints';
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
  alignItems: 'center'
});

const HeadingImage = styled.img({
  width: '2em',
  margin: 0,
  marginRight: '0.5em'
});

const Markdown = styled.div({
  a: {
    color: colors.primary,
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline'
    }
  },
  '.anchor': {
    color: 'inherit',
    svg: {
      fill: 'currentColor'
    }
  },
  '.float': {
    width: '50%',
    marginLeft: 24,
    marginBottom: 24,
    float: 'right',
    [breakpointSm]: {
      width: '100%',
      marginLeft: 0,
      float: 'none'
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

const Chapter = styled.div({
  marginTop: 64
});

const ChapterHeading = styled.h2({
  display: 'flex',
  alignItems: 'center'
});

const SectionTitle = styled.h4({
  marginBottom: 8
});

const SectionDescription = styled.p({
  fontSize: '1rem'
});

const anchorPattern = /<a href="([\w/#-]+)">([\w\s.,-]+)<\/a>/gm;

export default class Page extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);

    const hashElement = document.getElementById(
      this.props.location.hash.slice(1)
    );
    if (hashElement) {
      hashElement.scrollIntoView();
    }
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
    // loop through all the pages and construct a sidebar nav based on each
    // page's generated table of contents
    const tableOfContents = {};
    const imageForTitle = {};
    this.props.data.allMarkdownRemark.edges.forEach(({node}) => {
      if (node.frontmatter.path === '/' || !node.tableOfContents) {
        return;
      }

      let match;
      const matches = [];
      while ((match = anchorPattern.exec(node.tableOfContents)) !== null) {
        const title = match[2];
        const description = node.excerpt.slice(
          node.excerpt.indexOf(title) + title.length
        );
        matches.push({
          path: match[1],
          title,
          description: description
            .slice(0, description.indexOf('.') + 1)
            .trim()
            .replace(/\*/g, ''),
          link:
            node.frontmatter.path ===
            this.props.location.pathname.replace(/\/$/, '')
        });
      }

      tableOfContents[node.frontmatter.title] = matches;
      imageForTitle[node.frontmatter.title] =
        node.frontmatter.image.childImageSharp.fluid.src;
    });

    // determine current page's place in the order
    const {title, path, image} = this.props.data.markdownRemark.frontmatter;
    const pageIndex = this.props.data.allMarkdownRemark.edges.findIndex(
      ({node}) => node.frontmatter.path === path
    );

    // define next and previous pages
    const previousPage = this.props.data.allMarkdownRemark.edges[pageIndex - 1];
    const nextPage = this.props.data.allMarkdownRemark.edges[pageIndex + 1];

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
              contents={tableOfContents}
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
                {title && (
                  <Fragment>
                    <MainHeading>
                      {image && (
                        <HeadingImage src={image.childImageSharp.fluid.src} />
                      )}
                      {title}
                    </MainHeading>
                    <hr />
                  </Fragment>
                )}
                <Markdown>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: this.props.data.markdownRemark.html
                    }}
                  />
                  {this.props.location.pathname === '/' && (
                    <div>
                      {Object.keys(tableOfContents).map(key => (
                        <Chapter key={key}>
                          <ChapterHeading>
                            <HeadingImage src={imageForTitle[key]} />
                            {key}
                          </ChapterHeading>
                          <hr />
                          {tableOfContents[key].map(content => (
                            <div key={content.path}>
                              <SectionTitle>
                                <Link to={content.path}>{content.title}</Link>
                              </SectionTitle>
                              <SectionDescription>
                                {content.description}
                              </SectionDescription>
                            </div>
                          ))}
                        </Chapter>
                      ))}
                    </div>
                  )}
                </Markdown>
                <PageNav>
                  {previousPage && (
                    <PageNavLink to={previousPage.node.frontmatter.path}>
                      <MdChevronLeft />
                      <PageNavLinkText>
                        <PageNavLinkHeading>Previous</PageNavLinkHeading>
                        <PageNavLinkTitle>
                          {previousPage.node.frontmatter.title || 'Overview'}
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
        image {
          childImageSharp {
            fluid {
              src
            }
          }
        }
      }
    }

    allMarkdownRemark(sort: {order: ASC, fields: [frontmatter___order]}) {
      edges {
        node {
          excerpt
          tableOfContents(pathToSlugField: "frontmatter.path", maxDepth: 2)
          headings {
            depth
            value
          }
          frontmatter {
            path
            title
            image {
              childImageSharp {
                fluid {
                  src
                }
              }
            }
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
