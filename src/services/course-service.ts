export type Course = {
  id: number;
  title: string;
  detail: string;
  picture: string;
  price: number;
};

export async function getCourses(): Promise<Course[]> {
  const response = await fetch('https://api.codingthailand.com/api/course');
  const data = await response.json();
  return data.data as Course[];
}
