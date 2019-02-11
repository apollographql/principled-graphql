import Content from './content';
import FlexWrapper from 'gatsby-theme-apollo/src/components/flex-wrapper';
import Footer from './footer';
import Header from 'gatsby-theme-apollo/src/components/header';
import Helmet from 'react-helmet';
import Layout from 'gatsby-theme-apollo/src/components/layout';
import LogoTitle from 'gatsby-theme-apollo/src/components/logo-title';
import PropTypes from 'prop-types';
import React, {Component, createRef} from 'react';
import Sidebar from 'gatsby-theme-apollo/src/components/sidebar';
import SidebarNav from 'gatsby-theme-apollo/src/components/sidebar-nav';
import ogImage from '../../assets/images/og-image.png';
import styled from '@emotion/styled';
import {MdMenu} from 'react-icons/md';
import {breakpointMd} from 'gatsby-theme-apollo/src/util/breakpoints';
import {css} from '@emotion/core';
import {findDOMNode} from 'react-dom';
import {graphql} from 'gatsby';
import {size} from 'polished';

const OuterContentWrapper = styled.div({
  flexGrow: 1,
  overflow: 'auto'
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
    // generate a representation of the chapters and sections within them to
    // render the sidebar and table of contents on the overview page
    const chapters = this.props.data.allMarkdownRemark.edges
      .filter(({node}) => node.frontmatter.path !== '/' && node.tableOfContents)
      .map(({node}) => {
        let match;
        const sections = [];
        while ((match = anchorPattern.exec(node.tableOfContents)) !== null) {
          const title = match[2];
          const description = node.excerpt.slice(
            node.excerpt.indexOf(title) + title.length
          );
          sections.push({
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

        return {
          path: node.frontmatter.path,
          title: node.frontmatter.title,
          description: node.frontmatter.description,
          image: node.frontmatter.image.childImageSharp.fluid.src,
          sections
        };
      });

    // the sidebar expects the page structure in an object keyed by titles
    const sidebarConfig = chapters.reduce(
      (acc, chapter) => ({
        ...acc,
        [chapter.title]: chapter.sections
      }),
      {}
    );

    const {title, description} = this.props.data.site.siteMetadata;
    return (
      <Layout>
        <Helmet>
          <title>{this.props.data.markdownRemark.frontmatter.title}</title>
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={ogImage} />
        </Helmet>
        <FlexWrapper onClick={this.onWrapperClick}>
          <Sidebar
            ref={this.sidebar}
            open={this.state.sidebarOpen}
            title={title}
          >
            <SidebarNav
              alwaysExpanded
              pathname={this.props.location.pathname}
              contents={sidebarConfig}
            />
          </Sidebar>
          <OuterContentWrapper>
            <MobileHeader>
              <MenuButton onClick={this.openSidebar}>
                <MdMenu />
              </MenuButton>
              <LogoTitle />
            </MobileHeader>
            <Content
              isHome={location.pathname === '/'}
              chapters={chapters}
              page={this.props.data.markdownRemark}
              pages={this.props.data.allMarkdownRemark.edges}
            />
            <Footer />
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
        description
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
            description
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
        description
      }
    }
  }
`;
