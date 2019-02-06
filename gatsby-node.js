const path = require('path');

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

  const pageTemplate = path.resolve('src/templates/page.js');
  result.data.allMarkdownRemark.edges.forEach(({node}) => {
    actions.createPage({
      path: node.frontmatter.path,
      component: pageTemplate
    });
  });
};
