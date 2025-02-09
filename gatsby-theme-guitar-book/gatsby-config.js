const path = require('path');
const mapKeys = require('lodash/mapKeys');
const {colors} = require('./src/utils/colors');

module.exports = ({
  root,
  siteName,
  pageTitle,
  description,
  githubRepo,
  baseDir = '',
  contentDir = 'content',
  versions = {},
  gaTrackingId,
  ignore,
  checkLinksOptions
}) => {
  const gatsbyRemarkPlugins = [
    {
      resolve: 'gatsby-remark-autolink-headers',
    },
    {
      resolve: 'gatsby-remark-copy-linked-files',
      options: {
        ignoreFileExtensions: []
      }
    },
    {
      resolve: 'gatsby-remark-mermaid',
      options: {
        mermaidOptions: {
          themeCSS: `
            .node rect,
            .node circle,
            .node polygon,
            .node path {
              stroke-width: 2px;
              stroke: black;
              fill: black;
            }
            .node.secondary rect,
            .node.secondary circle,
            .node.secondary polygon,
            .node.tertiary rect,
            .node.tertiary circle,
            .node.tertiary polygon {
              fill: white;
            }
            .node.secondary rect,
            .node.secondary circle,
            .node.secondary polygon {
              stroke: grey;
            }
            .cluster rect,
            .node.tertiary rect,
            .node.tertiary circle,
            .node.tertiary polygon {
              stroke: white;
            }
            .cluster rect {
              fill: none;
              stroke-width: 2px;
            }
            .edgeLabel {
              background-color: white;
            }
            .messageText, .noteText, .loopText {
              font-size: 12px;
            }
            g rect, polygon.labelBox {
              stroke-width: 2px;
            }
            g rect.actor {
              stroke: white;
              fill: white;
            }
            g rect.note {
              stroke: grey;
              fill: white;
            }
            g line.loopLine, polygon.labelBox {
              stroke: black;
              fill: white;
            }
          `
        }
      }
    },
    'gatsby-remark-code-titles',
    {
      resolve: 'gatsby-remark-prismjs',
      options: {
        showLineNumbers: true
      }
    },
    'gatsby-remark-rewrite-relative-links',
    {
      resolve: 'gatsby-remark-check-links',
      options: checkLinksOptions
    }
  ];

  const plugins = [
    'gatsby-plugin-svgr',
    'gatsby-plugin-emotion',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-less',
      options: {
        modifyVars: mapKeys(colors, (value, key) => `color-${key}`)
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: path.join(root, contentDir),
        name: 'docs',
        ignore,
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: gatsbyRemarkPlugins
      }
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        gatsbyRemarkPlugins,
        remarkPlugins: [
          [{wrapperComponent: 'MultiCodeBlock'}]
        ]
      }
    },
    'gatsby-plugin-printer',
    ...Object.entries(versions).map(([name, branch]) => ({
      resolve: 'gatsby-source-git',
      options: {
        name,
        branch,
        remote: `https://github.com/${githubRepo}`,
        patterns: [
          path.join(baseDir, contentDir, '**'),
          path.join(baseDir, 'gatsby-config.js'),
          path.join(baseDir, '_config.yml')
        ]
      }
    })),
    {
      resolve: 'gatsby-plugin-eslint',
      options: {
        test: /\.js$|\.jsx$/,
        exclude: /(node_modules|.cache|public)/,
        stages: ['develop'],
        options: {
          emitWarning: true,
          failOnError: false
        }
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Guitar Book`,
        short_name: `Guitar Book`,
        description: `Track and play best guitar songs for camping`,
        start_url: `/`,
        background_color: `#ede9fb`,
        theme_color: `#3f20ba`,
        display: `standalone`,
        icon: require.resolve('../node_modules/gatsby-theme-guitar-book/src/assets/icon.png')
      }
    },
    `gatsby-plugin-offline`
  ];

  if (gaTrackingId) {
    plugins.push({
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: gaTrackingId
      }
    });
  }

  return {
    siteMetadata: {
      title: pageTitle || siteName,
      siteName,
      description
    },
    plugins
  };
};
