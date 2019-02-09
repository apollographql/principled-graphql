module.exports = {
  __experimentalThemes: [
    {
      resolve: 'gatsby-theme-apollo',
      options: {
        root: __dirname
      }
    }
  ],
  siteMetadata: {
    title: 'Principled GraphQL',
    description: 'Description here'
  },
  plugins: [
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
        plugins: ['gatsby-remark-autolink-headers', 'gatsby-remark-images']
      }
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp'
  ]
};
