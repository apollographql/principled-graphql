import ContentWrapper from 'gatsby-theme-apollo/src/components/content-wrapper';
import FlexWrapper from 'gatsby-theme-apollo/src/components/flex-wrapper';
import Layout from 'gatsby-theme-apollo/src/components/layout';
import PropTypes from 'prop-types';
import React from 'react';
import Sidebar from 'gatsby-theme-apollo/src/components/sidebar';
import SidebarNav from 'gatsby-theme-apollo/src/components/sidebar-nav';
import {graphql} from 'gatsby';

export default function Home(props) {
  return (
    <Layout>
      <FlexWrapper>
        <Sidebar title={props.data.site.siteMetadata.title}>
          <SidebarNav
            contents={{
              null: [
                {
                  path: '/',
                  title: 'Overview'
                }
              ],
              Integrity: [
                {
                  path: '/integrity',
                  title: '1. One Graph'
                },
                {
                  path: '/integrity#federated-implementation',
                  title: '2. Federated Implementation'
                },
                {
                  path: '/integrity#schema-registry',
                  title: '3. Track the Schema in a Registry'
                }
              ],
              Agility: [
                {
                  path: '/agility',
                  title: '4. Abstract, Demand-oriented Schema'
                },
                {
                  path: '/agility#schema-development',
                  title: '5. Use an Agile Approach to Schema Development'
                },
                {
                  path: '/agility#improve-performance',
                  title: '6. Iteratively Improve Performance'
                },
                {
                  path: '/agility#graph-metadata',
                  title: '7. Use Graph Metadata to Empower Developers'
                }
              ],
              Operations: [
                {
                  path: '/operations',
                  title: '8. Access and Demand Control'
                },
                {
                  path: '/operations#structured-logging',
                  title: '9. Structured Logging'
                },
                {
                  path: '/operations#graphql-layer',
                  title: '10. Separate the GraphQL Layer from the Service Layer'
                }
              ]
            }}
            pathname={props.location.pathname}
          />
        </Sidebar>
        <ContentWrapper>
          <h1>Test</h1>
        </ContentWrapper>
      </FlexWrapper>
    </Layout>
  );
}

Home.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
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
