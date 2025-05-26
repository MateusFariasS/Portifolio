
var typed = new Typed(".texto", {
  strings: ["Estudante de Engenharia de Software", "Desenvolvedor Front-end", "Entusiasta de Tecnologia"],
  typeSpeed: 100,
  backSpeed: 100,
  backDelay: 1000,
  loop: true,
});


const githubUsername = "MateusFariasS"; 


function handleHeaderScroll() {
  const header = document.querySelector('.header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
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
              .map((lang) => {
                let icon = '';
                switch(lang.toLowerCase()) {
                  case 'html': icon = '<i class="fab fa-html5"></i>'; break;
                  case 'css': icon = '<i class="fab fa-css3-alt"></i>'; break;
                  case 'javascript': icon = '<i class="fab fa-js"></i>'; break;
                  case 'java': icon = '<i class="fab fa-java"></i>'; break;
                  case 'python': icon = '<i class="fab fa-python"></i>'; break;
                  default: icon = '';
                }
                return `<span>${icon} ${lang}</span>`;
              })
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
          entry.target.classList.add('active');
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
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;
      
      if (!name || !email || !subject || !message) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
      
      try {
        await emailjs.send("service_tjbargv", "template_25m2ylk", {
          from_name: name,
          from_email: email,
          subject: subject,
          message: message,
          to_email: "mateus.fsantos08@gmail.com"
        });

        formSuccess.classList.add("show");
        contactForm.reset();
        
        setTimeout(() => {
          formSuccess.classList.remove("show");
        }, 5000);
      } catch (error) {
        console.error("Error sending email:", error);
        alert("Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.");
      }
    });
  }
}


function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}


function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, 
          behavior: 'smooth'
        });
      }
    });
  });
}


document.addEventListener("DOMContentLoaded", () => {
  handleHeaderScroll();
  fetchGithubProjects();
  handleScrollToTop();
  animateSectionsOnScroll();
  handleContactForm();
  setupSmoothScrolling();
});