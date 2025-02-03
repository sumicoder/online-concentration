import React from 'react';

type Props = {
    label: string;
};

const Heading: React.FC<Props> = ({ label }) => {
    return <h2 className="text-xl font-bold text-center">{label}</h2>;
};

export default Heading;
