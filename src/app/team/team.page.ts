import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-team',
  templateUrl: './team.page.html',
  styleUrls: ['./team.page.scss'],
})
export class TeamPage implements OnInit {
  teammates = [
    {
      img: 'assets/Team/connor.jpg',
      description: 'Hi I am Connor Grimes.\n\nI am completing my Bachelors of Computer Science from the University of Utah this semester.' +
      ' In this project I have focused on the development of the administration page and the reporting page for students.' +
      '\n\nMy technical interests include: working on old code bases and reading papers on AI. Some of my non-technical interests are martial arts, architecture, and reading. ' +
      'Throughout the development of Reading Pal, I have acquired a greater understanding of typescript and many web development concepts. These concepts were first introduced to me in a previous course, but that foundation was built upon during the development of Reading Pal.' + 
      '\n\nThe most enjoyable part about developing Reading Pal has been overcoming the learning curve of new technologies. The satisfaction of finally understanding how to use a library correctly was prevalent in my development time. Working with potential users of the project was also very exciting as it gave an outside meaning to our goals.',
      email: "cgrimes8400@gmail.com",
      linkedIn: "https://www.linkedin.com/in/connor-grimes-708807155/"
    },
    {
      img: 'assets/Team/bridger.jpg',
      description:
        "Hey, I'm Bridger Holt!\n\n" +
        "I am graduating with a BS in Computer Science and minor in Mathematics from the University of Utah. " +
        "For Reading Pal, I primarily focused on integrating the back-end API with the Angular front-end, " +
        "along with building out the gamification aspects (including the vocabulary game, experience bar, and badges).\n\n" +
        "I'm mostly interested in deeply technical systems, and have worked extensively in C++, C#, and Java. " +
        "Additionally, in university I have developed a strong science and mathematics background. " +
        "This includes extensive knowledge of Matlab and Python, " +
        "along with superb technical writing skills.\n\n" +
        "Previously, my web development experience primarily included working in PHP, wordpress, and low-level sockets. " +
        "By working on Reading Pal, I have become proficient in TypeScript, Angular, Ionic, and RxJS. " +
        "As someone who has worked in game engines like Unreal Engine and Unity, " +
        "I've greatly enjoyed developing the gamification aspects of Reading Pal. " +
        "Furthermore, it has been a lot of fun learning Angular's reactive forms and building sleek user interfaces.",
      email: "bridgerrholt@gmail.com",
      linkedIn: "https://www.linkedin.com/in/bridger-holt-68228ba5/"
    },
    {
      img: 'assets/Team/shem.png',
      description: "Hi, Im Shem,\n\n" +
      "I too will be graduating with a BS in CS from the University of Utah. This capstone project was a great way to exercise the knowledge I have learning while in the CS major. I worked on the backend services and database integration.\n\n" + 
      "This project was an awesome experience that helped me understand a little more what it is like to work on a real-world team project.\n\n" +
      "I chose to work on this project for my capstone because this is the kind of software I plan on working in for the majority of my future career. I plan to continue small projects like this as well. Even if it means adding to this one. Overall this was a good experience and I'm happy to see what comes next.\n\n",
      email: "ShemJohnson836@gmail.com",
      linkedIn: ""
    },
    {
      img: 'assets/Team/jared.jpg',
      description: 'Hi I am Jared Knight.\n\n I have a Bachelors of Computer Science from the University of Utah. In this project' +
          ' my main contributions consist of the reader design and implementation, the UI design, and lesson creation. ' +
          '\n\n My interests include data science and all of its glories, embedded systems, IOT, blockchain, and all areas of ' +
          'technology that aim to modernize how we work and live. Through this application I have gained an appreciation for web ' +
          'design and development. I have enjoyed learning ' +
          'new technologies such as Angular and Ionic. \n\nBeyond the technical, my favorite part of ReadingPal has been the ' +
          'project design. Brainstorming about features that would add utility and then seeing them come to fruition. There' +
          ' has been nothing more fulfilling than having a real teacher be amazed by features within ReadingPal knowing ' +
          'our work can have an impact on everyday lives.',
      email: "jayrodkoji@gmail.com",
      linkedIn: "https://www.linkedin.com/in/jared-knight-07a93a76/"
    }
  ]

  constructor() { }

  ngOnInit() {
  }

}
