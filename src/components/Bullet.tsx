import React from 'react';

const Bullet: React.FC<{ text: string }> = ({ text }) => {
    return <li>{text}</li>;
};

export default Bullet;