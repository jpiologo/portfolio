import React, { useState } from "react"; // 1. Importa React e useState
import { Cog, ExternalLink, Github, X, ChevronDown } from "lucide-react"; // 2. Importa ícones

interface ProjectCardProps {
	// 3. Define a interface das props
	project: {
		title: string; // 4. Título do projeto
		description: string; // 5. Descrição curta
		image: string; // 6. URL da imagem
		tags: string[]; // 7. Tags do projeto
		demoLink?: string; // 8. Link opcional para demo
		githubLink: string; // 9. Link para o GitHub
		details: {
			// 10. Detalhes expandidos
			challenge: string;
			solution: string;
			techStack: string[];
			features: string[];
		};
	};
}

const ProjectCard = ({ project }: ProjectCardProps) => {
	// 11. Componente funcional
	const [isExpanded, setIsExpanded] = useState(false); // 12. Estado para modal "detalhes"

	return (
		<>
			{/* 14. Card principal: flex-col h-full para layout vertical flexível */}
			<div className="bg-white rounded-xl shadow-lg overflow-hidden group flex flex-col h-full">
				{/* 15. Container da imagem, escala no hover */}
				<div className="relative overflow-hidden">
					<img
						src={project.image}
						alt={project.title}
						className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-300"
					/>
					{/* 16. Overlay de gradiente com botões no topo da imagem */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
						<div className="absolute bottom-4 left-4 right-4 flex justify-end gap-3">
							{project.demoLink ? (
								<a
									target="_blank"
									href={project.demoLink}
									className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
									rel="noreferrer"
								>
									<ExternalLink className="w-5 h-5 text-gray-800" />
								</a>
							) : (
								<div className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors">
									<span className="flex items-center gap-1 text-gray-600 font-semibold italic justify-center">
										Development Stage
										<Cog className="w-5 h-5 text-gray-800" />
									</span>
								</div>
							)}
							<a
								target="_blank"
								href={project.githubLink}
								className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
								rel="noreferrer"
							>
								<Github className="w-5 h-5 text-gray-800"/>
							</a>
						</div>
					</div>
				</div>

				{/* 17. Corpo do card: flex-col flex-1 para crescer e empurrar o botão */}
				<div className="p-6 flex flex-col flex-1">
					<h3 className="text-xl font-semibold mb-2">{project.title}</h3>{" "}
					{/* 18. Título */}
					<p className="text-gray-600 mb-4">{project.description}</p>{" "}
					{/* 19. Descrição */}
					<div className="flex flex-wrap gap-2 mb-4">
						{" "}
						{/* 20. Lista de tags */}
						{project.tags.map((tag, index) => (
							<span
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={index}
								className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm"
							>
								{tag}
							</span>
						))}
					</div>
					{/* 21. Wrapper do botão: mt-auto empurra para o final do flex container */}
					<div className="mt-auto">
						{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
						<button
							onClick={() => setIsExpanded(true)}
							className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
						>
							<ChevronDown className="w-4 h-4" />
							<span>View Details</span>
						</button>
					</div>
				</div>
			</div>

			{/* 22. Modal de detalhes, aparece se isExpanded for true */}
			{isExpanded && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						{/* 23. Cabeçalho fixo com título e botão fechar */}
						<div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
							<h3 className="text-2xl font-bold">{project.title}</h3>
							{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
							<button
								onClick={() => setIsExpanded(false)}
								className="p-2 hover:bg-gray-100 rounded-full transition-colors"
							>
								<X className="w-6 h-6" />
							</button>
						</div>

						{/* 24. Conteúdo do modal */}
						<div className="p-6 space-y-6">
							<img
								src={project.image}
								alt={project.title}
								className="w-full h-64 object-cover rounded-lg"
							/>

							<div>
								<h4 className="text-lg font-semibold mb-2 text-purple-600">
									Challenge
								</h4>
								<p className="text-gray-600">{project.details.challenge}</p>
							</div>

							<div>
								<h4 className="text-lg font-semibold mb-2 text-purple-600">
									Solution
								</h4>
								<p className="text-gray-600">{project.details.solution}</p>
							</div>

							<div>
								<h4 className="text-lg font-semibold mb-2 text-purple-600">
									Tech Stack
								</h4>
								<div className="flex flex-wrap gap-2">
									{project.details.techStack.map((tech, index) => (
										<span
											// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
											key={index}
											className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm"
										>
											{tech}
										</span>
									))}
								</div>
							</div>

							<div>
								<h4 className="text-lg font-semibold mb-2 text-purple-600">
									Key Features
								</h4>
								<ul className="list-disc list-inside space-y-2 text-gray-600">
									{project.details.features.map((feature, index) => (
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										<li key={index}>{feature}</li>
									))}
								</ul>
							</div>

							<div className="flex gap-4">
								{project.demoLink ? (
									<a
										target="_blank"
										href={project.demoLink}
										className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-center"
										rel="noreferrer"
									>
										Live Demo
									</a>
								) : (
									// biome-ignore lint/a11y/useButtonType: <explanation>
									<button
										disabled
										className="flex-1 bg-gray-300 text-white py-2 px-4 rounded-lg cursor-not-allowed"
									>
										Development Stage
									</button>
								)}
								<a
									target="_blank"
									href={project.githubLink}
									className="flex-1 border border-purple-600 text-purple-600 py-2 px-4 rounded-lg hover:bg-purple-50 transition-colors text-center"
									rel="noreferrer"
								>
									View Code
								</a>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ProjectCard; // 25. Exporta o componente
