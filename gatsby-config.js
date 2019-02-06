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
        path: `${__dirname}/src/pages`,
        name: 'pages'
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: ['gatsby-remark-autolink-headers']
      }
    }
  ]
};
