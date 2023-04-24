import './App.css';
import CategoryBrowser from "./components/CategoryBrowser.js";

function App() {
    const data = {
    selected_categories: [
        "6d18daff-94d1-489b-97ce-969d1c2912a6"  // Grammar
    ],
    categories: [
        {
            key: "64c3df14-7117-4453-8679-42ebfd18159c",
            title: "English language",
            children: [
                {
                    key: "6d18daff-94d1-489b-97ce-969d1c2912a6",
                    title: "Grammar",
                    children: [
                        {
                            key: "e742bdf5-2324-4b7c-ba63-08b9345c9f40",
                            title: "Expressing future",
                            children: []
                        },
                        {
                            key: "506112ea-af69-436e-af1b-64475de40992",
                            title: "Noun",
                            children: []
                        },
                        {
                            key: "2bc7beda-f447-49d8-87ad-72c6e649bbb8",
                            title: "Verb",
                            children: []
                        }
                    ]
                },
                {
                    key: "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    title: "Vocabulary",
                    children: [
                        {
                            key: "1b2ad022-731c-4a56-af0e-39b0384bb8c4",
                            title: "Holidays",
                            children: []
                        },
                        {
                            key: "0b075f21-8e05-49a1-a426-e39b772c3604",
                            title: "Household devices",
                            children: []
                        },
                        {
                            key: "671e6e84-f9e7-4113-b445-e2fceeee3f0c",
                            title: "Human body",
                            children: []
                        }
                    ]
                }
            ]
        }
    ]
};
  return (
      <div className="App">
        <CategoryBrowser
          categories={data.categories}
          selectedCategories={data.selected_categories}
        />
      </div>
  );
}

export default App;
