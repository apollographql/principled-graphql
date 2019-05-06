import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import styled from '@emotion/styled';
import {
  ContentWrapper,
  PageNav,
  breakpoints,
  colors
} from 'gatsby-theme-apollo';
import {Link} from 'gatsby';
import {size} from 'polished';

const InnerWrapper = styled.div({
  maxWidth: 800
});

const MainHeading = styled.h1({
  display: 'flex',
  alignItems: 'center'
});

const descriptionMargin = 4;
const ChapterDescription = styled.h4({
  display: 'block',
  marginTop: descriptionMargin,
  marginBottom: descriptionMargin,
  color: colors.text2
});

const HeadingImage = styled.img(size('2.5em'), {
  margin: 0,
  marginRight: '0.25em'
});

const Markdown = styled.div({
  a: {
    color: colors.primary,
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline'
    }
  },
  '.anchor': {
    color: 'inherit',
    svg: {
      fill: 'currentColor'
    }
  },
  'h2:not(:first-child)': {
    marginTop: 56
  },
  '.float': {
    width: '50%',
    marginLeft: 24,
    marginBottom: 24,
    float: 'right',
    [breakpoints.sm]: {
      width: '100%',
      marginLeft: 0,
      float: 'none'
    }
  }
});

const Chapter = styled.div({
  marginTop: 64
});

const ChapterHeading = styled.h2({
  display: 'flex',
  alignItems: 'center'
});

const SectionTitle = styled.h4({
  marginBottom: 8
});

const SectionDescription = styled.p({
  fontSize: '1rem'
});

export default function Content(props) {
  const {title, description, path, image} = props.page.frontmatter;

  // determine current page's place in the order
  const pageIndex = props.pages.findIndex(
    ({node}) => node.frontmatter.path === path
  );

  // assign next and previous pages
  const pages = props.pages.map(page => page.node.frontmatter);
  const nextPage = pages[pageIndex + 1];
  const prevPage = pages[pageIndex - 1];
  if (prevPage && !prevPage.title) {
    prevPage.title = 'Overview';
  }

  return (
    <ContentWrapper>
      <InnerWrapper>
        {title && (
          <Fragment>
            <MainHeading>
              {image && <HeadingImage src={image.childImageSharp.fluid.src} />}
              <span>
                {title}
                <ChapterDescription>{description}</ChapterDescription>
              </span>
            </MainHeading>
            <hr />
          </Fragment>
        )}
        <Markdown>
          <div
            dangerouslySetInnerHTML={{
              __html: props.page.html
            }}
          />
          {props.isHome && (
            <div>
              {props.contents.map(content => (
                <Chapter key={content.path}>
                  <ChapterHeading>
                    <HeadingImage src={content.image} />
                    <span>
                      {content.title}
                      <ChapterDescription>
                        {content.description}
                      </ChapterDescription>
                    </span>
                  </ChapterHeading>
                  <hr />
                  {content.pages.map(page => (
                    <div key={page.path}>
                      <SectionTitle>
                        <Link to={page.path}>{page.title}</Link>
                      </SectionTitle>
                      <SectionDescription>
                        {page.description}
                      </SectionDescription>
                    </div>
                  ))}
                </Chapter>
              ))}
            </div>
          )}
        </Markdown>
        <PageNav prevPage={prevPage} nextPage={nextPage} />
      </InnerWrapper>
    </ContentWrapper>
  );
}

Content.propTypes = {
  isHome: PropTypes.bool.isRequired,
  page: PropTypes.object.isRequired,
  pages: PropTypes.array.isRequired,
  contents: PropTypes.array.isRequired
};
