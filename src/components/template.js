import Content from './content';
import Footer from './footer';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import ogImage from '../assets/images/og-image.png';
import styled from '@emotion/styled';
import {
  FlexWrapper,
  Layout,
  Logo,
  MenuButton,
  ResponsiveSidebar,
  SEO,
  Sidebar,
  SidebarNav,
  breakpoints,
  colors
} from 'gatsby-theme-apollo-core';
import {graphql} from 'gatsby';

const headerHeight = 64;
const Header = styled.div({
  display: 'none',
  alignItems: 'center',
  height: headerHeight,
  width: '100%',
  padding: '0 24px',
  position: 'sticky',
  top: 0,
  color: colors.text1,
  backgroundColor: 'white',
  zIndex: 10,
  [breakpoints.md]: {
    display: 'flex'
  }
});

const Main = styled.main({
  flexGrow: 1
});

const anchorPattern = /<a href="([\w/#-]+)">([\w\s.,-]+)<\/a>/gm;

export default class Template extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  componentDidMount() {
    const hashElement = document.getElementById(
      this.props.location.hash.slice(1)
    );
    if (hashElement) {
      hashElement.scrollIntoView();
    }
  }

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

          pages.push({
            path: hashPath,
            title,
            description: description
              .slice(0, description.indexOf('.') + 1)
              .replace('>', '')
              .trim()
              .replace(/\*/g, '')
          });
        }

        return {
          path: node.frontmatter.path,
          title: node.frontmatter.title,
          description: node.frontmatter.description,
          image: node.frontmatter.image.publicURL,
          pages
        };
      });

    const {title, description} = this.props.data.site.siteMetadata;
    const {frontmatter} = this.props.data.markdownRemark;
    return (
      <Layout>
        <SEO
          title={frontmatter.title || title}
          description={frontmatter.description || description}
          siteName={title}
          twitterCard="summary_large_image"
        >
          <html lang="en" />
          <meta name="twitter:site" content="@apollographql" />
          <meta property="og:image" content={ogImage} />
          <meta
            name="twitter:image"
            content={'https://principledgraphql.com' + ogImage}
          />
        </SEO>
        <ResponsiveSidebar>
          {({
            sidebarRef,
            handleWrapperClick,
            handleSidebarNavLinkClick,
            sidebarOpen,
            openSidebar
          }) => (
            <FlexWrapper onClick={handleWrapperClick}>
              <Sidebar
                responsive
                ref={sidebarRef}
                open={sidebarOpen}
                logoLink="/"
              >
                <SidebarNav
                  alwaysExpanded
                  pathname={this.props.location.pathname}
                  contents={contents}
                  onLinkClick={handleSidebarNavLinkClick}
                />
              </Sidebar>
              <Main>
                <Header>
                  <MenuButton onClick={openSidebar} />
                  <Logo />
                </Header>
                <Content
                  isHome={!frontmatter.order}
                  contents={contents}
                  page={this.props.data.markdownRemark}
                  pages={this.props.data.allMarkdownRemark.edges}
                />
                <Footer />
              </Main>
            </FlexWrapper>
          )}
        </ResponsiveSidebar>
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
          publicURL
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
              publicURL
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
