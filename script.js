var typed = new Typed(".texto", {
  strings: ["Estudante de Engenharia de Software", ""],
  typeSpeed: 100,
  backSpeed: 100,
  backDelay: 1000,
  loop: true,
});

const githubUsername = "MateusFariasS"; 


async function fetchGithubUserInfo() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}`
    );
    if (!response.ok) {
      throw new Error("Não foi possível buscar informações do usuário");
    }
    const userData = await response.json();


    document.getElementById("user-name").textContent =
      userData.name || userData.login;
    document.getElementById("github-username").textContent = userData.login;
    document.getElementById("github-link").href = userData.html_url;

    if (userData.email) {
      document.getElementById("user-email").querySelector("span").textContent =
        userData.email;
      document.getElementById("user-email").href = `mailto:${userData.email}`;
    }

    if (userData.avatar_url) {
      document.getElementById("profile-img").src = userData.avatar_url;
    }
  } catch (error) {
    console.error("Erro ao buscar informações do usuário:", error);
  }
}


async function fetchGithubProjects() {
  const projectsContainer = document.getElementById("github-projects");

  try {
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6`
    );
    if (!response.ok) {
      throw new Error("Não foi possível buscar os projetos");
    }
    const projects = await response.json();


    projectsContainer.innerHTML = "";

    if (projects.length === 0) {
      projectsContainer.innerHTML = "<p>Nenhum projeto público encontrado.</p>";
      return;
    }

    projects.forEach(async (project) => {
 
      let languages = [];
      try {
        const langResponse = await fetch(project.languages_url);
        if (langResponse.ok) {
          const langData = await langResponse.json();
          languages = Object.keys(langData);
        }
      } catch (error) {
        console.error("Erro ao buscar linguagens:", error);
      }

      const projectCard = document.createElement("div");
      projectCard.className = "project-card";

      projectCard.innerHTML = `
                        <div class="project-content">
                            <h3 class="project-title">${project.name}</h3>
                            <p class="project-description">${
                              project.description || "Sem descrição disponível."
                            }</p>
                            <div class="project-tech">
                                ${languages
                                  .map((lang) => `<span>${lang}</span>`)
                                  .join("")}
                            </div>
                            <div class="project-links">
                                <a href="${project.html_url}" target="_blank">
                                    <i class="fab fa-github"></i> Repositório
                                </a>
                                ${
                                  project.homepage
                                    ? `
                                <a href="${project.homepage}" target="_blank">
                                    <i class="fas fa-external-link-alt"></i> Demo
                                </a>
                                `
                                    : ""
                                }
                            </div>
                        </div>
                    `;

      projectsContainer.appendChild(projectCard);
    });
  } catch (error) {
    console.error("Erro ao buscar projetos:", error);
    projectsContainer.innerHTML = `
                    <p>Ocorreu um erro ao carregar os projetos. Por favor, tente novamente mais tarde.</p>
                    <p>Erro: ${error.message}</p>
                `;
  }
}


function handleScrollToTop() {
  const backToTopButton = document.getElementById("back-to-top");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add("visible");
    } else {
      backToTopButton.classList.remove("visible");
    }
  });

  backToTopButton.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}


function animateSectionsOnScroll() {
  const sections = document.querySelectorAll("section");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });
}



function handleContactForm() {
  const contactForm = document.getElementById("contact-form");
  const formSuccess = document.getElementById("form-success");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      setTimeout(() => {
        formSuccess.classList.add("show");

        contactForm.reset();

        setTimeout(() => {
          formSuccess.classList.remove("show");
        }, 5000);
      }, 1000);
    });
  }
}


document.addEventListener("DOMContentLoaded", () => {
  fetchGithubUserInfo();
  fetchGithubProjects();
  handleScrollToTop();
  animateSectionsOnScroll();
  handleContactForm();
});
