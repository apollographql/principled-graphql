import LogoTitle from 'gatsby-theme-apollo/src/components/logo-title';
import React from 'react';
import colors from 'gatsby-theme-apollo/src/util/colors';
import styled from '@emotion/styled';

const Container = styled.footer({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 48,
  fontSize: 14,
  color: colors.text1,
  backgroundColor: colors.background
});

const Colophon = styled.span({
  margin: '20px 0'
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

const Divider = styled.hr({
  width: '100%',
  maxWidth: 400
});

export default function Footer() {
  return (
    <Container>
      <LogoTitle />
      <Colophon>Written by Geoff Schmidt</Colophon>
      <Divider />
      <FooterNav>
        <a href="https://github.com/apollographql/principled-graphql">
          View source code
        </a>{' '}
        | <a href="https://apollographql.com">ApolloGraphQL.com</a> |{' '}
        <a href="https://summit.graphql.com">GraphQL Summit</a>
      </FooterNav>
    </Container>
  );
}
