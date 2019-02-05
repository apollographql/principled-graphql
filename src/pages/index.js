import ContentWrapper from 'gatsby-theme-apollo/src/components/content-wrapper';
import FlexWrapper from 'gatsby-theme-apollo/src/components/flex-wrapper';
import Layout from 'gatsby-theme-apollo/src/components/layout';
import PropTypes from 'prop-types';
import React from 'react';
import Sidebar from 'gatsby-theme-apollo/src/components/sidebar';
import {graphql} from 'gatsby';

export default function Home(props) {
  return (
    <Layout>
      <FlexWrapper>
        <Sidebar title={props.data.site.siteMetadata.title}>hello</Sidebar>
        <ContentWrapper>
          <h1>Test</h1>
        </ContentWrapper>
      </FlexWrapper>
    </Layout>
  );
}

Home.propTypes = {
  data: PropTypes.object.isRequired
};

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
