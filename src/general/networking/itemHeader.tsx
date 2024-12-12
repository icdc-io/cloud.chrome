import React from 'react';
import { Grid, Header } from 'semantic-ui-react';

type ItemHeader = {
  title: string;
  traefik?: boolean;
  isTabbedView: boolean;
};

const ItemHeader = ({ title, traefik, isTabbedView }: ItemHeader) => {
  return (
    <Grid.Column verticalAlign="middle" width={4} style={isTabbedView ? { marginTop: 25 } : {}}>
      <Header as="h4" style={traefik && { fontSize: '20px' }}>
        {title}
      </Header>
    </Grid.Column>
  );
};

export default ItemHeader;
