import prisma from '../db/index';

export async function prepopulate(userId: number) {
    try { 
        // create the root folder === bibliothek
        const rootFolder = await prisma.folder.create({ 
        data: {
            name: 'root',
            root: true,
            userId: userId
        }
        });
        const books = await Promise.all(startingLibrary.map(async (book) => {
            return prisma.book.create({ 
                data: {
                    title: book.title,
                    format: book.size,
                    padding: book.size,
                    folderId: rootFolder.id,
                    userId: userId
                }
            })
        }));

        for (let i = 0; i < 3 ; i++) {
            await Promise.all(startingLibrary[i].pages.map(async (page, index) => {
                return prisma.page.create({ 
                    data: {
                        content: page,
                        bookId: books[i].id,
                        index: index 
                    }
                })
            }));
        };
        
      } catch (error) { 
        console.error(error); 
      } 
}


const startingLibrary = [
    {
      "title": "Adventure Journey",
      "size": "small",
      "pages": [
        "In the heart of the bustling city, a young adventurer named Alex set out on an unexpected journey. The tall skyscrapers cast long shadows, creating a maze of light and darkness. Alex's heart pounded with excitement as they navigated through the crowded streets, each step taking them closer to the unknown. The city was alive with the hum of vehicles and the chatter of people, a symphony of urban life. The journey had just begun, and Alex knew that this adventure would be unlike any other.",
        "As Alex ventured further into the city, they stumbled upon an old, mysterious bookstore. The wooden sign creaked in the wind, and the scent of aged paper wafted through the air. Curiosity piqued, Alex pushed open the door, and the tinkling of a bell announced their arrival. The interior was dimly lit, with towering shelves filled with books of every genre imaginable. An elderly shopkeeper greeted Alex with a knowing smile, as if they had been expecting this very moment. Without hesitation, Alex began to explore the aisles, each book a potential key to untold secrets.",
        "Among the countless volumes, one particular book caught Alex's eye. Its cover was adorned with intricate designs, and the title, 'The Chronicles of the Hidden Realm,' shimmered in gold. The shopkeeper's eyes twinkled as they handed the book to Alex. 'This book chooses its reader,' they said cryptically. Eager to uncover its mysteries, Alex found a cozy corner and began to read. The pages revealed tales of magical lands, heroic quests, and ancient prophecies. Alex was utterly captivated, losing track of time as they delved deeper into the story.",
        "As the day turned to dusk, Alex reluctantly closed the book and looked up. The shopkeeper approached, a glint of amusement in their eyes. 'Did you find what you were looking for?' they asked. Alex nodded, feeling a strange sense of connection to the hidden realm described in the book. The shopkeeper smiled and handed Alex a small, ornate key. 'This is for you,' they said. 'It will unlock the door to your own adventure.' Alex took the key, their heart racing with anticipation. With a grateful nod, they left the bookstore, the key clutched tightly in their hand.",
        "Back on the streets, the city lights flickered to life, casting a golden glow over the buildings. Alex knew that their journey was far from over. The key felt warm in their palm, a reminder of the adventure that awaited. With renewed determination, they set off into the night, ready to embrace whatever challenges and wonders lay ahead. The city, once familiar and ordinary, now seemed full of endless possibilities. Alex's adventure had only just begun, and they were eager to discover where it would lead."
      ]
    },
    {
      "title": "Mystic Quest",
      "size": "medium",
      "pages": [
        "In a tranquil village nestled at the edge of an ancient forest, a young seeker named Elara embarked on a quest shrouded in mystery. The villagers whispered tales of a hidden temple deep within the woods, a place said to hold the secrets of the universe. Elara, driven by an insatiable curiosity, decided to unravel the enigma. The path ahead was laden with overgrown foliage, and the air was thick with the scent of pine and earth. With each step, the forest seemed to come alive, its ancient energy guiding Elara toward her destination.",
        "Elara's journey took her through winding trails and past ancient trees whose roots intertwined like the hands of old friends. Along the way, she encountered mystical creatures and heard the songs of unseen birds. The forest was a realm of enchantment, where time seemed to stand still. One evening, as the sun dipped below the horizon, Elara stumbled upon a glistening river. Its waters sparkled in the twilight, and she felt an inexplicable urge to follow its course. The river's gentle flow led her to a clearing bathed in moonlight, and there, at its center, stood a weathered stone altar.",
        "Atop the altar lay an intricately carved artifact, glowing with an ethereal light. Elara approached it with reverence, her fingers tracing the delicate patterns. As she lifted the artifact, a surge of energy coursed through her body, filling her with a profound sense of clarity. Visions of the temple appeared before her eyes, revealing the path she must take. Elara knew that the artifact was a key, a guide to the hidden temple. With newfound resolve, she set off once more, the artifact illuminating her way through the darkened forest.",
        "Days turned into nights as Elara followed the visions granted by the artifact. She crossed treacherous terrain, navigated through dense thickets, and overcame countless obstacles. Each challenge brought her closer to the truth, and her bond with the forest grew stronger. One morning, as the first rays of sunlight pierced through the canopy, Elara caught sight of an ancient stone structure. Vines and moss clung to its weathered walls, and the air around it hummed with an otherworldly energy. Elara had found the hidden temple, her heart swelling with triumph and anticipation.",
        "Entering the temple, Elara was greeted by a vast chamber adorned with celestial symbols and ancient inscriptions. The walls seemed to pulse with a life of their own, and the air was charged with magic. At the center of the chamber stood a pedestal, and on it, a scroll bound with a golden ribbon. Elara approached with a sense of awe, her journey's end now in sight. As she unrolled the scroll, the temple's secrets unfurled before her. The knowledge she sought was hers, and with it, the power to shape her destiny. Elara's mystic quest had reached its culmination, and a new chapter in her life was about to begin."
      ]
    },
    {
      "title": "Celestial Odyssey",
      "size": "big",
      "pages": [
        "High above the Earth, in the boundless expanse of space, a daring astronaut named Orion embarked on a celestial odyssey. The vastness of the cosmos stretched out before him, a sea of stars and distant galaxies. Equipped with the latest technology and a spirit of exploration, Orion's mission was to uncover the mysteries of the universe. His spacecraft, the 'Stellar Voyager,' glided silently through the void, its instruments humming with life. As Orion gazed out of the observation window, he marveled at the beauty of the cosmos, feeling a deep connection to the stars that had guided humanity for millennia.",
        "Orion's journey led him to the edge of a shimmering nebula, a cloud of gas and dust that glowed with vibrant colors. The nebula's ethereal beauty was mesmerizing, and Orion couldn't resist the urge to venture closer. As the Stellar Voyager approached, the ship's sensors detected strange energy readings. Intrigued, Orion decided to investigate further. He donned his spacesuit and prepared for a spacewalk, the nebula's luminescent tendrils beckoning him forward. Stepping out into the void, Orion felt a profound sense of awe as he floated among the stars, the nebula's energy enveloping him like a cosmic embrace.",
        "As Orion explored the nebula, he discovered a cluster of ancient artifacts, their origins shrouded in mystery. Each artifact pulsed with an otherworldly glow, and Orion carefully collected them, knowing they held the key to untold knowledge. Back on the Stellar Voyager, he analyzed the artifacts, uncovering encrypted messages and intricate designs. The artifacts spoke of an ancient civilization that had once thrived among the stars, their wisdom etched into the very fabric of the cosmos. Orion's excitement grew as he realized that he was on the brink of a monumental discovery, one that could change humanity's understanding of the universe.",
        "Days turned into weeks as Orion delved deeper into the nebula's secrets. The artifacts revealed a map, guiding him to a distant star system where the remnants of the ancient civilization were said to be hidden. Orion set a course for the star system, his heart filled with anticipation. As the Stellar Voyager approached its destination, Orion's sensors detected a massive structure orbiting a distant planet. The structure was a colossal space station, its architecture unlike anything he had ever seen. With a sense of wonder, Orion docked his ship and prepared to explore the remnants of the ancient civilization.",
        "Inside the space station, Orion was greeted by a breathtaking sight. The interior was adorned with celestial motifs and intricate carvings, depicting the history and achievements of the ancient civilization. At the center of the station, a massive crystal pulsed with energy, its light illuminating the chamber. Orion approached the crystal, feeling its power resonate within him. As he placed his hand on the crystal, visions of the ancient civilization's knowledge and wisdom flooded his mind. Orion had uncovered the legacy of a lost civilization, and with it, the hope of a brighter future for humanity. His celestial odyssey had reached its zenith, and the stars beckoned him to continue his journey."
      ]
    }
]
  