import ContentWrapper from 'gatsby-theme-apollo/src/components/content-wrapper';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import colors from 'gatsby-theme-apollo/src/util/colors';
import styled from '@emotion/styled';
import {Link} from 'gatsby';
import {MdChevronLeft, MdChevronRight} from 'react-icons/md';
import {
  breakpointMd,
  breakpointSm
} from 'gatsby-theme-apollo/src/util/breakpoints';
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

const HeadingImage = styled.img({
  width: '2em',
  margin: 0,
  marginRight: '0.5em'
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
  '.float': {
    width: '50%',
    marginLeft: 24,
    marginBottom: 24,
    float: 'right',
    [breakpointSm]: {
      width: '100%',
      marginLeft: 0,
      float: 'none'
    }
  }
});

const PageNav = styled.nav({
  display: 'flex',
  padding: '64px 0',
  [breakpointMd]: {
    padding: '32px 0'
  }
});

const PageNavLink = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  color: 'inherit',
  textDecoration: 'none',
  svg: size(20)
});

const PageNavLinkText = styled.div(({align = 'left'}) => {
  const marginProperty = `margin${align.charAt(0).toUpperCase() +
    align.slice(1)}`;
  return {
    [marginProperty]: 24,
    textAlign: align,
    [breakpointMd]: {
      [marginProperty]: 16
    }
  };
});

const PageNavLinkHeading = styled.div({
  fontSize: 12,
  letterSpacing: 2,
  textTransform: 'uppercase'
});

const PageNavLinkTitle = styled.div({
  color: colors.text1
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
  // determine current page's place in the order
  const {title, description, path, image} = props.page.frontmatter;
  const pageIndex = props.pages.findIndex(
    ({node}) => node.frontmatter.path === path
  );

  // define next and previous pages
  const previousPage = props.pages[pageIndex - 1];
  const nextPage = props.pages[pageIndex + 1];

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
              {props.chapters.map(chapter => (
                <Chapter key={chapter.path}>
                  <ChapterHeading>
                    <HeadingImage src={chapter.image} />
                    <span>
                      {chapter.title}
                      <ChapterDescription>
                        {chapter.description}
                      </ChapterDescription>
                    </span>
                  </ChapterHeading>
                  <hr />
                  {chapter.sections.map(section => (
                    <div key={section.path}>
                      <SectionTitle>
                        <Link to={section.path}>{section.title}</Link>
                      </SectionTitle>
                      <SectionDescription>
                        {section.description}
                      </SectionDescription>
                    </div>
                  ))}
                </Chapter>
              ))}
            </div>
          )}
        </Markdown>
        <PageNav>
          {previousPage && (
            <PageNavLink to={previousPage.node.frontmatter.path}>
              <MdChevronLeft />
              <PageNavLinkText>
                <PageNavLinkHeading>Previous</PageNavLinkHeading>
                <PageNavLinkTitle>
                  {previousPage.node.frontmatter.title || 'Overview'}
                </PageNavLinkTitle>
              </PageNavLinkText>
            </PageNavLink>
          )}
          {nextPage && (
            <PageNavLink
              to={nextPage.node.frontmatter.path}
              style={{marginLeft: 'auto'}}
            >
              <PageNavLinkText align="right">
                <PageNavLinkHeading>Next</PageNavLinkHeading>
                <PageNavLinkTitle>
                  {nextPage.node.frontmatter.title}
                </PageNavLinkTitle>
              </PageNavLinkText>
              <MdChevronRight />
            </PageNavLink>
          )}
        </PageNav>
      </InnerWrapper>
    </ContentWrapper>
  );
}

Content.propTypes = {
  isHome: PropTypes.bool.isRequired,
  page: PropTypes.object.isRequired,
  pages: PropTypes.array.isRequired,
  chapters: PropTypes.array.isRequired
};
