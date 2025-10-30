import React from "react";
import {
	Code2,
	Database,
	Server,
	Layout,
	Terminal,
	GitBranch,
	Braces,
} from "lucide-react";

const SkillCategory = ({
	title,
	skills,
	icon: Icon,
}: {
	title: string;
	skills: { name: string; width: string }[]; // Mudança: skills agora é um array de objetos
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	icon: any;
}) => (
	<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
		<div className="flex items-center mb-4">
			<Icon className="w-6 h-6 text-indigo-600 mr-3" />
			<h3 className="text-xl font-semibold">{title}</h3>
		</div>
		<div className="space-y-3">
			{skills.map((skill, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				<div key={index} className="flex items-center">
					<div className="w-full bg-gray-200 rounded-full h-2.5">
						<div
							className="bg-indigo-600 h-2.5 rounded-full"
							style={{ width: skill.width || "80%" }} // Usando a width específica de cada skill
						/>
					</div>
					<span className="ml-3 text-sm text-gray-600 min-w-[80px]">
						{skill.name}
					</span>
				</div>
			))}
		</div>
	</div>
);

const Skills = () => {
	return (
		<section id="skills" className="py-20">
			<div className="max-w-6xl mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-4xl font-bold mb-4">Technical Skills</h2>
					<p className="text-gray-600 max-w-2xl mx-auto">
						My expertise spans across various technologies and tools, allowing
						me to deliver comprehensive solutions for complex problems.
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					<SkillCategory
						title="Languages"
						icon={Braces}
						skills={[
							{ name: "Javascript", width: "93%" },
							{ name: "Typescript", width: "73%" },
							{ name: "Java", width: "40%" },
							{ name: "C/C++", width: "56%" },
						]}
					/>
					<SkillCategory
						title="Frontend"
						icon={Layout}
						skills={[
							{ name: "React.js", width: "88%" },
							{ name: "Next.js", width: "90%" },
							{ name: "TailwindCSS", width: "95%" },
							{ name: "UX/UI", width: "75%" },
						]}
					/>
					<SkillCategory
						title="Backend"
						icon={Server}
						skills={[
							{ name: "Node.js", width: "90%" },
							{ name: "Nest.js", width: "70%" },
							{ name: "Express.js", width: "88%" },
							{ name: "Next.js", width: "90%" },
							{ name: "RESTful API's", width: "90%" },
						]}
					/>
					<SkillCategory
						title="Database"
						icon={Database}
						skills={[
							{ name: "PostgreSQL", width: "95%" },
							{ name: "MySQL", width: "90%" },
							{ name: "Docker", width: "70%" },
							{ name: "Prisma ORM", width: "90%" },
							{ name: "Redis", width: "72%" },
						]}
					/>
					<SkillCategory
						title="Development Tools"
						icon={Terminal}
						skills={[
							{ name: "Biome", width: "98%" },
							{ name: "Swagger", width: "87%" },
							{ name: "Postman", width: "95%" },
						]}
					/>
					<SkillCategory
						title="Best Practices"
						icon={Code2}
						skills={[
							{ name: "Clean Code", width: "100%" },
							{ name: "TDD", width: "90%" },
							{ name: "Scrum", width: "95%" },
							{ name: "Deployment", width: "81%" },
							{ name: "CI/CD", width: "93%" },
						]}
					/>
					<SkillCategory
						title="Version Control"
						icon={GitBranch}
						skills={[
							{ name: "Git", width: "95%" },
							{ name: "Git Flows", width: "90%" },
							{ name: "Branching", width: "88%" },
							{ name: "Collaboration", width: "85%" },
							{ name: "Semantic Commits", width: "95%" },
						]}
					/>
				</div>
			</div>
		</section>
	);
};

export default Skills;
