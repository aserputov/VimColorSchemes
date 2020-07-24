import React, { useEffect } from "react";
import { graphql, Link } from "gatsby";
import PropTypes from "prop-types";

import { getRepositoryInfos } from "../../utils/repository";

import Layout from "../../components/layout";
import Mosaic from "../../components/mosaic";
import RepositoryTitle from "../../components/repositoryTitle";
import SEO from "../../components/seo";
import ZoomableImage from "../../components/zoomableImage";

import "./indes.scss";

const RepositoryPage = ({ data, location }) => {
  const fromPath = location?.state?.fromPath;

  const {
    ownerName,
    name,
    githubUrl,
    featuredImage,
    description,
    images,
  } = getRepositoryInfos(data.repository);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const eventListener = event => handleKeyPress(event);

      window.addEventListener("keydown", eventListener);
      return () => window.removeEventListener("keydown", eventListener);
    }
  }, []);

  return (
    <Layout>
      <SEO title={`${name} vim color scheme, by ${ownerName}`} />
      <div className="repository">
        <div className="repository__hero">
          <RepositoryTitle ownerName={ownerName} name={name} />
          <a href={githubUrl} target="_blank" rel="noopener noreferrer">
            Github home
          </a>
        </div>
        <p>{description}</p>
        {!!featuredImage && (
          <ZoomableImage image={featuredImage} className="repository__image" />
        )}
        {!!images && images.length > 0 && <Mosaic images={images} />}
        <Link to={fromPath || "/"}>back</Link>
      </div>
    </Layout>
  );
};

RepositoryPage.propTypes = {
  data: PropTypes.shape({
    repository: PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      githubUrl: PropTypes.string.isRequired,
      owner: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      featuredImage: PropTypes.shape({
        childImageSharp: PropTypes.shape({
          fluid: PropTypes.shape({}).isRequired,
        }).isRequired,
      }),
      images: PropTypes.arrayOf(
        PropTypes.shape({
          childImageSharp: PropTypes.shape({
            fluid: PropTypes.shape({}).isRequired,
          }).isRequired,
        }).isRequired,
      ),
    }),
  }),
  location: PropTypes.shape({
    fromPath: PropTypes.string,
  }),
};

export const query = graphql`
  query($ownerName: String!, $name: String!) {
    repository: mongodbVimcsRepositories(
      owner: { name: { eq: $ownerName } }
      name: { eq: $name }
    ) {
      name
      description
      githubUrl: github_url
      owner {
        name
      }
      featuredImage: processed_featured_image {
        childImageSharp {
          fluid {
            ...GatsbyImageSharpFluid
          }
        }
      }
      images: processed_images {
        childImageSharp {
          fluid {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  }
`;

const handleKeyPress = event => {
  console.log(event);
};

export default RepositoryPage;
