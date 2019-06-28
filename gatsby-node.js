exports.createPages = async ({actions, graphql}) => {
  const result = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              path
            }
          }
        }
      }
    }
  `);

  const template = require.resolve('./src/components/template');
  result.data.allMarkdownRemark.edges.forEach(({node}) => {
    actions.createPage({
      path: node.frontmatter.path,
      component: template
    });
  });
};
