import React from 'react';

interface ExperienceCardProps {
  title: string;
  company: string;
  period: string;
  description: string;
}

const ExperienceCard = ({ title, company, period, description }: ExperienceCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-indigo-600">{company}</p>
        </div>
        <span className="text-gray-500">{period}</span>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default ExperienceCard;