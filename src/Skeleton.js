import React from 'react';

const Skeleton = ({ className, width }) => <div className={(className || '') + ' skeleton'} style={{ width }} />;

export default Skeleton;
