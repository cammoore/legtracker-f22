import React from 'react';
import { Container } from 'react-bootstrap';
import ManageHearings from '../components/ManageHearings';
import ManageMeasures from '../components/ManageMeasures';

const ManageDatabase = () => (
  <Container>
    <ManageHearings />
    <ManageMeasures />
  </Container>
);

export default ManageDatabase;
