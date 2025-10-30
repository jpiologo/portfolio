import type React from "react";

interface SkillCardProps {
	icon: React.ReactNode;
	title: string;
	skills: string[];
}

const SkillCard = ({ icon, title, skills }: SkillCardProps) => {
	return (
		<div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
			<div className="flex items-center mb-4">
				{icon}
				<h3 className="text-xl font-semibold ml-3">{title}</h3>
			</div>
			<ul className="space-y-2">
				{skills.map((skill, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<li key={index} className="flex items-center text-gray-600">
						<span className="w-2 h-2 bg-indigo-600 rounded-full mr-2" />
						{skill}
					</li>
				))}
			</ul>
		</div>
	);
};

export default SkillCard;
