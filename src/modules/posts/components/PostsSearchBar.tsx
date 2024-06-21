import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/rootReducer";
import { postTypes } from "../types";
import { Link } from "react-router-dom";

export default function Main() {
  const posts = useSelector((state: RootState) => state.posts);
  const initialValue = { search: "", filter: [] as postTypes[] };
  const [value, setValue] = useState(initialValue);

  const regexFilter = /^\w/i;

  const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.match(regexFilter)) {
      const regex = new RegExp(`^${e.target.value}`, "i");
      const result = posts.filter((post) => post.title.match(regex));
      setValue({ search: e.target.value, filter: result });
    } else {
      setValue(initialValue);
    }
  };

  return (
    <div className="mb-5">
      <form className="relative mx-5 rounded-lg border border-solid border-slate-200 max-lg:mt-16">
        <button className="absolute left-0 top-1/2 -translate-y-1/2 rounded-l-md pb-[0.46rem] pl-1 pr-2 pt-[0.45rem] hover:bg-purple-700 hover:text-white dark:hover:bg-purple-100 dark:hover:text-black">
          <SearchOutlinedIcon />
        </button>

        <input
          onChange={onchange}
          className="w-full appearance-none rounded-lg py-2 pl-10 pr-2 outline-none ring-purple-700 focus:ring-2 dark:ring-purple-100"
          type="text"
          placeholder="Search..."
        />
      </form>
      {value.filter.length > 0 && (
        <div className="mx-5 mt-2 border border-solid border-slate-200 bg-white dark:bg-slate-800">
          <FilteredPosts posts={value.filter} />
        </div>
      )}
    </div>
  );
}

function FilteredPosts({ posts }: { posts: postTypes[] }) {
  return posts.map((post) => (
    <Link to={`/posts/post/${post._id}`}>
      <div className="cursor-pointer p-2 hover:bg-purple-100 dark:hover:bg-purple-700">
        <p className="mb-[-0.1rem] font-bold">{post.title}</p>
        <span className="text-sm text-slate-500 dark:text-slate-300">
          {post.date}
        </span>
      </div>
    </Link>
  ));
}
