import '../styles.less';
import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';

export default function Layout(props) {
  return (
    <StaticQuery
      query={graphql`
        {
          site {
            siteMetadata {
              title
              description
            }
          }
        }
      `}
      render={(data) => {
        const { title, description } = data.site.siteMetadata;
        return (
          <>
            <Helmet defaultTitle={title} titleTemplate={`%s - ${title}`}>
              <meta name="description" content={description} />
            </Helmet>
            {props.children}
          </>
        );
      }}
    />
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
