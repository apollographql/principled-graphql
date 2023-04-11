module.exports = {
  siteMetadata: {
    title: 'Principled GraphQL',
    description: 'Best practices for implementing and scaling a graph'
  },
  plugins: [
    {
      resolve: 'gatsby-theme-apollo-core',
      options: {
        root: __dirname
      }
    },
    {
      resolve: 'gatsby-plugin-google-gtag',
      options: {
        trackingIds: [
          'UA-74643563-15', // universal analytics - going away Jul 2023
          'G-W76RRKRXRM'
        ]
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/content`,
        name: 'content'
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        excerpt_separator: '<!-- end -->',
        plugins: [
          'gatsby-remark-autolink-headers',
          {
            resolve: 'gatsby-remark-copy-linked-files',
            options: {
              ignoreFileExtensions: []
            }
          }
        ]
      }
    }
  ]
};
