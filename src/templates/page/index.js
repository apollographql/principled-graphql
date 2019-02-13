import Content from './content';
import Footer from './footer';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Component, createRef} from 'react';
import ogImage from '../../assets/images/og-image.png';
import styled from '@emotion/styled';
import {
  FlexWrapper,
  Header,
  Layout,
  LogoTitle,
  Sidebar,
  SidebarNav,
  breakpoints,
  headerHeight
} from 'gatsby-theme-apollo';
import {MdMenu} from 'react-icons/md';
import {css} from '@emotion/core';
import {findDOMNode} from 'react-dom';
import {graphql, withPrefix} from 'gatsby';
import {size} from 'polished';

const OuterContentWrapper = styled.div({
  flexGrow: 1,
  overflow: 'auto',
  outline: 'none',
  WebkitOverflowScrolling: 'touch',
  [breakpoints.md]: {
    paddingTop: headerHeight
  }
});

const MobileHeader = styled(Header)({
  display: 'none',
  width: '100%',
  position: 'fixed',
  [breakpoints.md]: {
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
    const contents = this.props.data.allMarkdownRemark.edges
      .filter(({node}) => node.frontmatter.order > 0 && node.tableOfContents)
      .map(({node}) => {
        let match;
        const pages = [];
        while ((match = anchorPattern.exec(node.tableOfContents)) !== null) {
          const path = match[1];
          const hash = path.slice(path.lastIndexOf('/') + 1);
          const hashPath = node.frontmatter.path + hash;
          const title = match[2];
          const description = node.excerpt.slice(
            node.excerpt.indexOf(title) + title.length
          );

          const isLink =
            withPrefix(node.frontmatter.path) ===
            this.props.location.pathname.replace(/\/$/, '');

          pages.push({
            path: isLink ? withPrefix(hashPath) : hashPath,
            title,
            description: description
              .slice(0, description.indexOf('.') + 1)
              .replace('>', '')
              .trim()
              .replace(/\*/g, ''),
            link: isLink
          });
        }

        return {
          path: node.frontmatter.path,
          title: node.frontmatter.title,
          description: node.frontmatter.description,
          image: node.frontmatter.image.childImageSharp.fluid.src,
          pages
        };
      });

    const {title, description} = this.props.data.site.siteMetadata;
    return (
      <Layout>
        <Helmet>
          <title>{this.props.data.markdownRemark.frontmatter.title}</title>
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={ogImage} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@apollographql" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta
            name="twitter:image"
            content={'https://principledgraphql.com' + ogImage}
          />
        </Helmet>
        <FlexWrapper onClick={this.onWrapperClick}>
          <Sidebar
            noLogo
            responsive
            ref={this.sidebar}
            open={this.state.sidebarOpen}
            title={title}
          >
            <SidebarNav
              alwaysExpanded
              pathname={this.props.location.pathname}
              contents={contents}
            />
          </Sidebar>
          <OuterContentWrapper tabIndex="0">
            <MobileHeader>
              <MenuButton onClick={this.openSidebar}>
                <MdMenu />
              </MenuButton>
              <LogoTitle noLogo />
            </MobileHeader>
            <Content
              isHome={!this.props.data.markdownRemark.frontmatter.order}
              contents={contents}
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
        order
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
            order
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
