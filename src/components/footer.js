import React from 'react';
import styled from '@emotion/styled';
import {Logo, colors} from 'gatsby-theme-apollo-core';

const Container = styled.footer({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 32,
  fontSize: 14,
  color: colors.text1,
  backgroundColor: colors.background
});

const Colophon = styled.span({
  marginTop: 8,
  marginBottom: 20,
  a: {
    color: colors.primary,
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline'
    }
  }
});

const FooterNav = styled.nav({
  textAlign: 'center',
  a: {
    margin: '0 12px',
    color: 'inherit',
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline'
    }
  }
});

const FooterNavLinks = styled.div({
  marginTop: 4
});

const Divider = styled.hr({
  width: '100%',
  maxWidth: 400
});

export default function Footer() {
  return (
    <Container>
      <Logo />
      <Colophon>
        Written by <a href="https://twitter.com/GeoffQL">Geoff Schmidt</a> and{' '}
        <a href="https://twitter.com/debergalis">Matt DeBergalis</a>
      </Colophon>
      <Divider />
      <FooterNav>
        <a href="https://github.com/apollographql/principled-graphql">
          View source code
        </a>
        <FooterNavLinks>
          <a href="https://apollographql.com">ApolloGraphQL.com</a> |{' '}
          <a href="https://graphql-summit-2019.eventbrite.com">
            GraphQL Summit
          </a>
        </FooterNavLinks>
      </FooterNav>
    </Container>
  );
}
