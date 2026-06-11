import React from 'react';
const Placeholder: React.FC<{ name: string }> = ({ name }) => (
    <div className="flex items-center justify-center h-full">
        <h1 className="text-xl font-light">{name} Coming Soon</h1>
    </div>
);
export default Placeholder;
