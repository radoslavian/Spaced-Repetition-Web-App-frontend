import { tomorrow } from "../utils/testHelpers";

export const authToken = {
    auth_token: "7f3371589a52d0ef17877c61d1c82cdf9b7d8f3f"
};
export const authToken_1 = {
    auth_token: "1f3371582a52d0ef17877c61d1c82cdf9b7d8f4f"
};
export const authToken_2 = {
    auth_token: "3f4471582a52d0ef17877c61d1c82cdf9b7d8f8f"
};
export const userData = {
    email: "user@userdomain.com.su",
    id: "626e4d32-a52f-4c15-8f78-aacf3b69a9b2",
    username: "user_name"
};

export const userCategories = {
    "selected_categories": [
        "64c3df14-7117-4453-8679-42ebfd18159c"
    ],
    "categories": [
        {
            "key": "64c3df14-7117-4453-8679-42ebfd18159c",
            "title": "English language",
            "children": [
                {
                    "key": "6d18daff-94d1-489b-97ce-969d1c2912a6",
                    "title": "Grammar",
                    "children": [
                        {
                            "key": "e742bdf5-2324-4b7c-ba63-08b9345c9f40",
                            "title": "Expressing future",
                            "children": []
                        },
                        {
                            "key": "506112ea-af69-436e-af1b-64475de40992",
                            "title": "Noun",
                            "children": []
                        },
                        {
                            "key": "2bc7beda-f447-49d8-87ad-72c6e649bbb8",
                            "title": "Verb",
                            "children": []
                        }
                    ]
                },
                {
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary",
                    "children": [
                        {
                            "key": "1b2ad022-731c-4a56-af0e-39b0384bb8c4",
                            "title": "Holidays",
                            "children": []
                        },
                        {
                            "key": "0b075f21-8e05-49a1-a426-e39b772c3604",
                            "title": "Household devices",
                            "children": []
                        },
                        {
                            "key": "671e6e84-f9e7-4113-b445-e2fceeee3f0c",
                            "title": "Human body",
                            "children": []
                        }
                    ]
                }
            ]
        }
    ]
};

export const userCategories2 = {
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

export const memorizedCardsFirstPage = {
    "count": 62,
    "next": "http://localhost:8000/api/users/09ee01d5-ade6-48d5-81b8-c5be870fd0c0/cards/memorized/?page=2",
    "previous": null,
    "results": [
        {
            "id": "3dc52454-4931-4583-9737-81e6a56ac127",
            "body": "<b>Example question on a card in a \"Vocabulary\" category.\r\n<p>A few special cases to note about <code class=\"docutils literal notranslate\"><span class=\"pre\">list_display</span></code>:</p></b>\r\n<hr />\r\nExample answer on a card.",
            "projected_review_data": null,
            "categories": [
                {
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary"
                }
            ],
            "cram_link": null,
            "computed_interval": 1,
            "lapses": 0,
            "reviews": 1,
            "total_reviews": 1,
            "last_reviewed": "2023-05-10",
            "introduced_on": "2023-05-10T10:06:01.224005Z",
            "review_date": "2023-05-12",
            "grade": 4,
            "easiness_factor": 2.5,
            "comment": null
        },
    ]
};

export const memorizedCardsSecondPage = {
    "count": 62,
    "next": "http://localhost:8000/api/users/09ee01d5-ade6-48d5-81b8-c5be870fd0c0/cards/memorized/?page=3",
    "previous": "http://localhost:8000/api/users/09ee01d5-ade6-48d5-81b8-c5be870fd0c0/cards/memorized/?page=1",
    "results": [
        {
            "id": "5949947a-92ad-4e10-94dc-51c7da11c6e8",
            "body": "card with tomorrow's review date",
            "projected_review_data": null,
            "categories": [
                {
                    "key": "6d18daff-94d1-489b-97ce-969d1c2912a6",
                    "title": "Grammar"
                },
                {
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary"
                }
            ],
            "cram_link": "/api/users/7cfaec0a-0cc6-4249-8240-b52e40b4da7a/cards/cram-queue/5949947a-92ad-4e10-94dc-51c7da11c6e8",
            "computed_interval": 1,
            "lapses": 0,
            "reviews": 1,
            "total_reviews": 1,
            "last_reviewed": "2023-05-10",
            "introduced_on": "2023-05-10T10:06:01.179692Z",
            "review_date": tomorrow(),
            "grade": 4,
            "easiness_factor": 2.5,
            "comment": null
        },
	{
            "id": "5b457c11-b751-436c-9cfe-f3f4d173c1ba",
            "body": "Card with cram link",
            "projected_review_data": null,
            "categories": [
                {
                    "key": "6d18daff-94d1-489b-97ce-969d1c2912a6",
                    "title": "Grammar"
                },
                {
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary"
                }
            ],
            "cram_link": "/api/users/7cfaec0a-0cc6-4249-8240-b52e40b4da7a/cards/cram-queue/5b457c11-b751-436c-9cfe-f3f4d173c1ba",
            "computed_interval": 1,
            "lapses": 0,
            "reviews": 1,
            "total_reviews": 1,
            "last_reviewed": "2023-05-10",
            "introduced_on": "2023-05-10T10:06:01.179692Z",
            "review_date": "2023-05-11",
            "grade": 4,
            "easiness_factor": 2.5,
            "comment": null
        },
        {
            "id": "7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa",
            "body": "<b>Example question on a <i>grammar</i> card.</b>\r\n<hr />\r\nExample anwer.",
            "projected_review_data": null,
            "categories": [
                {
                    "key": "6d18daff-94d1-489b-97ce-969d1c2912a6",
                    "title": "Grammar"
                },
                {
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary"
                }
            ],
            "cram_link": null,
            "computed_interval": 1,
            "lapses": 0,
            "reviews": 1,
            "total_reviews": 1,
            "last_reviewed": "2023-05-10",
            "introduced_on": "2023-05-10T10:06:01.179692Z",
            "review_date": "2023-05-11",
            "grade": 4,
            "easiness_factor": 2.5,
            "comment": null
        },
    ]
};

export const memorizedCardsThirdPage = {
    "count": 62,
    "next": null,
    "previous": "http://localhost:8000/api/users/09ee01d5-ade6-48d5-81b8-c5be870fd0c0/cards/memorized/?page=2",
    "results": [
        {
            "id": "b9f2a0ec-fac1-4574-a553-26c5e8d8b5ab",
            "body": "<b><a>front</a></b>\r\n<hr />\r\n<b><i>odpowiedź</i></i>",
            "projected_review_data": null,
            "categories": [
                {
                    "key": "6d18daff-94d1-489b-97ce-969d1c2912a6",
                    "title": "Grammar"
                },
                {
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary"
                }
            ],
            "cram_link": null,
            "computed_interval": 1,
            "lapses": 0,
            "reviews": 1,
            "total_reviews": 1,
            "last_reviewed": "2023-05-10",
            "introduced_on": "2023-05-10T10:06:01.236892Z",
            "review_date": "2023-05-13",
            "grade": 4,
            "easiness_factor": 2.5,
            "comment": null
        },
    ]
};

export const queuedCardsFirstPage = {
    "count": 60,
    "next": "http://localhost:8000/api/users/09ee01d5-ade6-48d5-81b8-c5be870fd0c0/cards/queued/page=2",
    "previous": null,
    "results": [
        {
            "id": "f4055d8c-c97f-419f-b6db-61d36f53da47",
            "body": "<!-- fallback card template -->\n<!-- used when the Card instance does not supply template for rendering -->\n<!-- base template for cards-->\n<div class=\"container\" id=\"card-body\">\n    \n<div class=\"question\">\n    <p>Serve give phone.</p>\n</div>\n<hr />\n<div class=\"answer\">\n    <p>Quality project.</p>\n</div>\n\n</div>",
            "categories": [
                {
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary"
                }
            ]
        }
    ]
};

export const queuedCardsMiddlePage = {
    "count": 60,
    "next": "http://localhost:8000/api/users/09ee01d5-ade6-48d5-81b8-c5be870fd0c0/cards/queued/?page=3",
    "previous": "http://localhost:8000/api/users/09ee01d5-ade6-48d5-81b8-c5be870fd0c0/cards/queued/?page=1",
    "results": [
        {
            "id": "5f143904-c9d1-4e5b-ac00-01258d09965a",
            "created_on": "2023-04-06 13:10:48.900927+00:00",
            "body": "<!-- fallback card template -->\n<!-- used when the Card instance does not supply template for rendering -->\n<!-- base template for cards-->\n<div class=\"container\" id=\"card-body\">\n    \n<div class=\"question\">\n    <p>Employee baby.</p>\n</div>\n<hr />\n<div class=\"answer\">\n    <p>Move her light hope.</p>\n</div>\n\n</div>",
            "categories": [
                {
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary"
                }
            ]
        },
	{
            "id": "4a58594b-1c84-41f5-b4f0-72dc573b6406",
            "body": "<!-- fallback card template -->\n<!-- used when the Card instance does not supply template for rendering -->\n<!-- base template for cards-->\n<div class=\"container\" id=\"card-body\">\n    \n<div class=\"question\">\n    <p>Employee baby.</p>\n</div>\n<hr />\n<div class=\"answer\">\n    <p>Move her light hope.</p>\n</div>\n\n</div>",
            "categories": [
                {
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary"
                }
            ]
        },
    ]
};

export const queuedCardsThirdPage = {
    "count": 60,
    "next": null,
    "previous": "http://localhost:8000/api/users/09ee01d5-ade6-48d5-81b8-c5be870fd0c0/cards/queued/?page=2",
    "results": [
        {
            "id": "5cd3446f-0b68-4224-8bb8-f04fe4ed83cb",
            "body": "<!-- fallback card template -->\n<!-- used when the Card instance does not supply template for rendering -->\n<!-- base template for cards-->\n<div class=\"container\" id=\"card-body\">\n    \n<div class=\"question\">\n    <p>Politics thing.</p>\n</div>\n<hr />\n<div class=\"answer\">\n    <p>Grow policy guess.</p>\n</div>\n\n</div>",
            "categories": [
                {
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary"
                }
            ]
        }
    ]
};

export const emptyCardsList = {
    "count": 0,
    "next": null,
    "previous": null,
    "results": []
}

export const outstandingPrevPage = {
    "count": 3,
    "next": "http://localhost:8000/api/users/09ee01d5-ade6-48d5-81b8-c5be870fd0c0/cards/outstanding/?page=2",
    "previous": null,
    "results": [
        {
            "id": "91d1ef25-b1c8-4c49-8b00-215f90088232",
            "body": "<!-- fallback card template -->\n<!-- used when the Card instance does not supply template for rendering -->\n<!-- base template for cards-->\n<div class=\"container\" id=\"card-body\">\n    \n<div class=\"question\">\n    <p>Feeling common rest.</p>\n</div>\n<hr />\n<div class=\"answer\">\n    <p>Perhaps animal rich.</p>\n</div>\n\n</div>",
            "projected_review_data": {
                "0": {
                    "easiness": 1.7000000000000002,
                    "interval": 1,
                    "reviews": 0,
                    "review_date": "2023-05-16"
                },
                "1": {
                    "easiness": 1.96,
                    "interval": 1,
                    "reviews": 0,
                    "review_date": "2023-05-16"
                },
                "2": {
                    "easiness": 2.1799999999999997,
                    "interval": 1,
                    "reviews": 0,
                    "review_date": "2023-05-16"
                },
                "3": {
                    "easiness": 2.36,
                    "interval": 6,
                    "reviews": 2,
                    "review_date": "2023-05-21"
                },
                "4": {
                    "easiness": 2.5,
                    "interval": 6,
                    "reviews": 2,
                    "review_date": "2023-05-21"
                },
                "5": {
                    "easiness": 2.6,
                    "interval": 6,
                    "reviews": 2,
                    "review_date": "2023-05-21"
                }
            },
            "categories": [
                {
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary"
                }
            ],
            "cram_link": null,
            "computed_interval": 1,
            "lapses": 0,
            "reviews": 1,
            "total_reviews": 1,
            "last_reviewed": "2023-05-10",
            "introduced_on": "2023-05-10T10:06:01.257239Z",
            "review_date": "2023-05-12",
            "grade": 4,
            "easiness_factor": 2.5,
            "comment": null
        },
    ]
};

export const outstandingMiddlePage = {
    "count": 3,
    "next": "http://localhost:8000/api/users/09ee01d5-ade6-48d5-81b8-c5be870fd0c0/cards/outstanding/?page=3",
    "previous": "http://localhost:8000/api/users/09ee01d5-ade6-48d5-81b8-c5be870fd0c0/cards/outstanding/?page=2",  // out of place but does the job
    "results": [
        {
            "id": "7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa",
            "body": `<div class="card-body">
  <div class="card-question">
    Example card question.
  </div>
  <div class="card-answer">
    Example Card answer.
  </div>
</div>`,
            "projected_review_data": {
                "0": {
                    "easiness": 1.7000000000000002,
                    "interval": 1,
                    "reviews": 0,
                    "review_date": "2023-05-16"
                },
                "1": {
                    "easiness": 1.96,
                    "interval": 1,
                    "reviews": 0,
                    "review_date": "2023-05-16"
                },
                "2": {
                    "easiness": 2.1799999999999997,
                    "interval": 1,
                    "reviews": 0,
                    "review_date": "2023-05-16"
                },
                "3": {
                    "easiness": 2.36,
                    "interval": 6,
                    "reviews": 2,
                    "review_date": "2023-05-21"
                },
                "4": {
                    "easiness": 2.5,
                    "interval": 6,
                    "reviews": 2,
                    "review_date": "2023-05-21"
                },
                "5": {
                    "easiness": 2.6,
                    "interval": 6,
                    "reviews": 2,
                    "review_date": "2023-05-21"
                }
            },
            "categories": [
                {
                    "key": "6d18daff-94d1-489b-97ce-969d1c2912a6",
                    "title": "Grammar"
                },
                {
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary"
                }
            ],
            "cram_link": null,
            "computed_interval": 1,
            "lapses": 0,
            "reviews": 1,
            "total_reviews": 1,
            "last_reviewed": "2023-05-10",
            "introduced_on": "2023-05-10T10:06:01.179692Z",
            "review_date": "2023-05-11",
            "grade": 4,
            "easiness_factor": 2.5,
            "comment": null
        },
        {
            "id": "c0320d44-c157-4857-a2b8-39ce89d168f5",
            "body": "<b>Example question on a <i>grammar</i> card.</b>\r\n<hr />\r\nExample answer (outstanding).",
            "projected_review_data": {
                "0": {
                    "easiness": 1.7000000000000002,
                    "interval": 1,
                    "reviews": 0,
                    "review_date": "2023-05-16"
                },
                "1": {
                    "easiness": 1.96,
                    "interval": 1,
                    "reviews": 0,
                    "review_date": "2023-05-16"
                },
                "2": {
                    "easiness": 2.1799999999999997,
                    "interval": 1,
                    "reviews": 0,
                    "review_date": "2023-05-16"
                },
                "3": {
                    "easiness": 2.36,
                    "interval": 6,
                    "reviews": 2,
                    "review_date": "2023-05-21"
                },
                "4": {
                    "easiness": 2.5,
                    "interval": 6,
                    "reviews": 2,
                    "review_date": "2023-05-21"
                },
                "5": {
                    "easiness": 2.6,
                    "interval": 6,
                    "reviews": 2,
                    "review_date": "2023-05-21"
                }
            },
            "categories": [
                {
                    "key": "6d18daff-94d1-489b-97ce-969d1c2912a6",
                    "title": "Grammar"
                },
                {
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary"
                }
            ],
            "cram_link": null,
            "computed_interval": 1,
            "lapses": 0,
            "reviews": 1,
            "total_reviews": 1,
            "last_reviewed": "2023-05-10",
            "introduced_on": "2023-05-10T10:06:01.179692Z",
            "review_date": "2023-05-11",
            "grade": 4,
            "easiness_factor": 2.5,
            "comment": null
        },
    ]
};

export const outstandingNextPage = {
    "count": 62,
    "next": null,
    "previous": "http://localhost:8000/api/users/09ee01d5-ade6-48d5-81b8-c5be870fd0c0/cards/outstanding/?page=2",
    "results": [
        {
            "id": "c6168ba7-6eac-4e1c-806b-3ce111bcdec3",
            "body": "<!-- fallback card template -->\n<!-- used when the Card instance does not supply template for rendering -->\n<!-- base template for cards-->\n<div class=\"container\" id=\"card-body\">\n    \n<div class=\"question\">\n    <p>Between plant it.</p>\n</div>\n<hr />\n<div class=\"answer\">\n    <p>Business present.</p>\n</div>\n\n</div>",
            "projected_review_data": {
                "0": {
                    "easiness": 1.7000000000000002,
                    "interval": 1,
                    "reviews": 0,
                    "review_date": "2023-05-16"
                },
                "1": {
                    "easiness": 1.96,
                    "interval": 1,
                    "reviews": 0,
                    "review_date": "2023-05-16"
                },
                "2": {
                    "easiness": 2.1799999999999997,
                    "interval": 1,
                    "reviews": 0,
                    "review_date": "2023-05-16"
                },
                "3": {
                    "easiness": 2.36,
                    "interval": 6,
                    "reviews": 2,
                    "review_date": "2023-05-21"
                },
                "4": {
                    "easiness": 2.5,
                    "interval": 6,
                    "reviews": 2,
                    "review_date": "2023-05-21"
                },
                "5": {
                    "easiness": 2.6,
                    "interval": 6,
                    "reviews": 2,
                    "review_date": "2023-05-21"
                }
            },
            "categories": [
                {
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary"
                }
            ],
            "cram_link": null,
            "computed_interval": 1,
            "lapses": 0,
            "reviews": 1,
            "total_reviews": 1,
            "last_reviewed": "2023-05-10",
            "introduced_on": "2023-05-10T10:06:01.647250Z",
            "review_date": "2023-05-13",
            "grade": 4,
            "easiness_factor": 2.5,
            "comment": null
        },
    ]
};

export const allCardsPrev = {
    "highest_count": 62,
    "overall_total": 122,
    "next": "http://localhost:8000/api/users/09ee01d5-ade6-48d5-81b8-c5be870fd0c0/cards/?limit=20&offset=20",
    "previous": null,
    "results": [
        {
            "id": "5cd3446f-0b68-4224-8bb8-f04fe4ed83cb",
            "body": "<!-- fallback card template -->\n<!-- used when the Card instance does not supply template for rendering -->\n<!-- base template for cards-->\n<div class=\"container\" id=\"card-body\">\n    \n<div class=\"question\">\n    <p>Politics thing.</p>\n</div>\n<hr />\n<div class=\"answer\">\n    <p>Grow policy guess.</p>\n</div>\n\n</div>",
            "categories": [
                {
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary"
                }
            ],
            "type": "queued"
        },
        {
            "id": "c6168ba7-6eac-4e1c-806b-3ce111bcdec3",
            "body": "<!-- fallback card template -->\n<!-- used when the Card instance does not supply template for rendering -->\n<!-- base template for cards-->\n<div class=\"container\" id=\"card-body\">\n    \n<div class=\"question\">\n    <p>Between plant it.</p>\n</div>\n<hr />\n<div class=\"answer\">\n    <p>Business present.</p>\n</div>\n\n</div>",
            "projected_review_data": {
                "0": {
                    "easiness": 1.7000000000000002,
                    "interval": 1,
                    "reviews": 0,
                    "review_date": "2023-05-17"
                },
                "1": {
                    "easiness": 1.96,
                    "interval": 1,
                    "reviews": 0,
                    "review_date": "2023-05-17"
                },
                "2": {
                    "easiness": 2.1799999999999997,
                    "interval": 1,
                    "reviews": 0,
                    "review_date": "2023-05-17"
                },
                "3": {
                    "easiness": 2.36,
                    "interval": 6,
                    "reviews": 2,
                    "review_date": "2023-05-22"
                },
                "4": {
                    "easiness": 2.5,
                    "interval": 6,
                    "reviews": 2,
                    "review_date": "2023-05-22"
                },
                "5": {
                    "easiness": 2.6,
                    "interval": 6,
                    "reviews": 2,
                    "review_date": "2023-05-22"
                }
            },
            "categories": [
                {
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary"
                }
            ],
            "cram_link": null,
            "computed_interval": 1,
            "lapses": 0,
            "reviews": 1,
            "total_reviews": 1,
            "last_reviewed": "2023-05-10",
            "introduced_on": "2023-05-10T10:06:01.647250Z",
            "review_date": "2023-05-13",
            "grade": 4,
            "easiness_factor": 2.5,
            "comment": null,
            "type": "memorized"
        },
    ]
};

export const allCardsMiddle = {
    "highest_count": 62,
    "overall_total": 122,
    "next": "http://localhost:8000/api/users/09ee01d5-ade6-48d5-81b8-c5be870fd0c0/cards/?limit=20&offset=40",
    "previous": "http://localhost:8000/api/users/09ee01d5-ade6-48d5-81b8-c5be870fd0c0/cards/?limit=20",
    "results": [
	{
            "id": "5b457c11-b751-436c-9cfe-f3f4d173c1ba",
            "body": "Card with cram link",
            "projected_review_data": null,
            "categories": [
                {
                    "key": "6d18daff-94d1-489b-97ce-969d1c2912a6",
                    "title": "Grammar"
                },
                {
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary"
                }
            ],
            "cram_link": "/api/users/7cfaec0a-0cc6-4249-8240-b52e40b4da7a/cards/cram-queue/5b457c11-b751-436c-9cfe-f3f4d173c1ba",
            "computed_interval": 1,
            "lapses": 0,
            "reviews": 1,
            "total_reviews": 1,
            "last_reviewed": "2023-05-10",
            "introduced_on": "2023-05-10T10:06:01.179692Z",
            "review_date": "2023-05-11",
            "grade": 4,
            "easiness_factor": 2.5,
            "comment": null,
	    "type": "memorized"
        },
        {
            "id": "f8f3ef31-1554-450f-ad7b-589bfd0e068d",
            "body": "<!-- fallback card template -->\n<!-- used when the Card instance does not supply template for rendering -->\n<!-- base template for cards-->\n<div class=\"container\" id=\"card-body\">\n    \n<div class=\"question\">\n    <p>Can figure quality.</p>\n</div>\n<hr />\n<div class=\"answer\">\n    <p>Along drug how.</p>\n</div>\n\n</div>",
            "projected_review_data": {
                "0": {
                    "easiness": 1.7000000000000002,
                    "interval": 1,
                    "reviews": 0,
                    "review_date": "2023-05-17"
                },
                "1": {
                    "easiness": 1.96,
                    "interval": 1,
                    "reviews": 0,
                    "review_date": "2023-05-17"
                },
                "2": {
                    "easiness": 2.1799999999999997,
                    "interval": 1,
                    "reviews": 0,
                    "review_date": "2023-05-17"
                },
                "3": {
                    "easiness": 2.36,
                    "interval": 6,
                    "reviews": 2,
                    "review_date": "2023-05-22"
                },
                "4": {
                    "easiness": 2.5,
                    "interval": 6,
                    "reviews": 2,
                    "review_date": "2023-05-22"
                },
                "5": {
                    "easiness": 2.6,
                    "interval": 6,
                    "reviews": 2,
                    "review_date": "2023-05-22"
                }
            },
            "categories": [
                {
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary"
                }
            ],
            "cram_link": null,
            "computed_interval": 1,
            "lapses": 0,
            "reviews": 1,
            "total_reviews": 1,
            "last_reviewed": "2023-05-10",
            "introduced_on": "2023-05-10T10:06:01.868156Z",
            "review_date": "2023-05-12",
            "grade": 4,
            "easiness_factor": 2.5,
            "comment": null,
            "type": "memorized"
        },
        {
            "id": "5f143904-c9d1-4e5b-ac00-01258d09965a",
            "body": "<!-- fallback card template -->\n<!-- used when the Card instance does not supply template for rendering -->\n<!-- base template for cards-->\n<div class=\"container\" id=\"card-body\">\n    \n<div class=\"question\">\n    <p>Employee baby.</p>\n</div>\n<hr />\n<div class=\"answer\">\n    <p>Move her light hope.</p>\n</div>\n\n</div>",
            "categories": [
                {
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary"
                }
            ],
            "created_on": "2023-04-06 13:10:48.900927+00:00",
            "type": "queued"
        },
    ]
    
};

export const allCardsNext = {
    "highest_count": 62,
    "overall_total": 122,
    "next": "http://localhost:8000/api/users/09ee01d5-ade6-48d5-81b8-c5be870fd0c0/cards/?limit=20&offset=60",
    "previous": "http://localhost:8000/api/users/09ee01d5-ade6-48d5-81b8-c5be870fd0c0/cards/?limit=20&offset=20",
    "results": [
        {
            "id": "f4055d8c-c97f-419f-b6db-62d36f53da47",
            "body": "next body",
            "categories": [
                {
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary"
                }
            ],
            "type": "queued"
        },
        {
            "id": "7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa",
            "body": "<b>Example question on a <i>grammar</i> card.</b>\r\n<hr />\r\nExample anwer.",
            "projected_review_data": null,
            "categories": [
		{
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary"
                }
	    ],
            "cram_link": null,
            "computed_interval": 1,
            "lapses": 0,
            "reviews": 1,
            "total_reviews": 1,
            "last_reviewed": "2023-05-10",
            "introduced_on": "2023-05-10T10:06:01.179692Z",
            "review_date": "2023-05-11",
            "grade": 4,
            "easiness_factor": 2.5,
            "comment": null,
            "type": "memorized"
        }
    ]
};

export const allCardsNext_1 = {
    "highest_count": 62,
    "overall_total": 122,
    "next": null,
    "previous": "http://localhost:8000/api/users/09ee01d5-ade6-48d5-81b8-c5be870fd0c0/cards/?limit=20&offset=40",
    "results": [
        {
            "id": "57a00a2b-e020-4055-8146-edf12b4e7b36",
            "body": "next body",
            "categories": [
                {
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary"
                }
            ],
            "type": "queued"
        },
        {
            "id": "e6e7b3ea-72d7-4663-8c0d-591c7b9fcafb",
            "body": "<b>Example question on a <i>grammar</i> card.</b>\r\n<hr />\r\nExample anwer.",
            "projected_review_data": null,
            "categories": [
		{
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary"
                }
	    ],
            "cram_link": null,
            "computed_interval": 1,
            "lapses": 0,
            "reviews": 1,
            "total_reviews": 1,
            "last_reviewed": "2023-05-10",
            "introduced_on": "2023-05-10T10:06:01.179692Z",
            "review_date": "2023-05-11",
            "grade": 4,
            "easiness_factor": 2.5,
            "comment": null,
            "type": "memorized"
        }
    ]
};

export const memorizedCard = {
    "id": "5f143904-c9d1-4e5b-ac00-01258d09965a",
    "body": "<!-- fallback card template -->\n<!-- used when the Card instance does not supply template for rendering -->\n<!-- base template for cards-->\n<div class=\"container\" id=\"card-body\">\n    \n<div class=\"question\">\n    <p>House moment.</p>\n</div>\n<hr />\n<div class=\"answer\">\n    <p>Sound high short.</p>\n</div>\n\n</div>",
    "projected_review_data": null,
    "categories": [],
    "cram_link": "/api/users/7cfaec0a-0cc6-4249-8240-b52e40b4da7a/cards/cram-queue/a0a5e0bb-d17a-4f1a-9945-ecb0bc5fc4ad",
    "computed_interval": 1,
    "lapses": 0,
    "reviews": 0,
    "total_reviews": 1,
    "last_reviewed": "2023-05-22",
    "introduced_on": "2023-05-22T18:40:59.069564Z",
    "review_date": "2023-05-23",
    "created_on": "2023-04-06 13:10:48.900927+00:00",
    "grade": 1,
    "easiness_factor": 1.96,
    "comment": null,
};

export const cardBrowserTestCards = [
    {
        type: "queued",
        body: "<p>Fake <b>card</b> one Very long title Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis rutrum lacus quis tellus aliquet, quis ornare felis imperdiet. Vivamus et elit scelerisque sapien blandit consequat vel non eros.</p>",
        id: "3475ddea-2f52-4669-93ee-b1298b1f6c97",
    },
    {
        type: "memorized",
        body: "<p>Fake card two</p>",
        id: "9e477201-5852-48c8-92fb-3520c2bef099",
    },
    {
        type: "disabled",
        body: "<p>Fake card three</p>",
        id: "2ccd1b58-945e-40b3-98df-da6b6fe44266",
    }
];

export const cramQueueFirstPage = {
    "count": 62,
    "next": "http://localhost:8000/api/users/09ee01d5-ade6-48d5-81b8-c5be870fd0c0/cards/cram-queue/?page=2",
    "previous": null,
    "results": [
        {
            "id": "3dc52454-4131-4583-9737-81j6a56ac127",
            "body": "<b>Example question on a card in a \"Vocabulary\" category.\r\n<p>A few special cases to note about <code class=\"docutils literal notranslate\"><span class=\"pre\">list_display</span></code>:</p></b>\r\n<hr />\r\nExample answer on a card.",
            "projected_review_data": null,
            "categories": [
                {
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary"
                }
            ],
            "cram_link": null,
            "computed_interval": 1,
            "lapses": 0,
            "reviews": 1,
            "total_reviews": 1,
            "last_reviewed": "2023-05-10",
            "introduced_on": "2023-05-10T10:06:01.224005Z",
            "review_date": "2023-05-12",
            "grade": 4,
            "easiness_factor": 2.5,
            "comment": null
        },
    ]
};

export const cramQueueSecondPage = {
    "count": 62,
    "next": "http://localhost:8000/api/users/09ee01d5-ade6-48d5-81b8-c5be870fd0c0/cards/cram-queue/?page=3",
    "previous": "http://localhost:8000/api/users/09ee01d5-ade6-48d5-81b8-c5be870fd0c0/cards/cram-queue/?page=1",
    "results": [
        {
            "id": "7cf7ed26-bfd3-45z8-a9fc-a284a86a6bfa",
            "body": "<b>Example question on a <i>grammar</i> card.</b>\r\n<hr />\r\nExample anwer.",
            "projected_review_data": null,
            "categories": [
                {
                    "key": "6d18daff-94d1-489b-97ce-969d1c2912a6",
                    "title": "Grammar"
                },
                {
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary"
                }
            ],
            "cram_link": null,
            "computed_interval": 1,
            "lapses": 0,
            "reviews": 1,
            "total_reviews": 1,
            "last_reviewed": "2023-05-10",
            "introduced_on": "2023-05-10T10:06:01.179692Z",
            "review_date": "2023-05-11",
            "grade": 4,
            "easiness_factor": 2.5,
            "comment": null
        },
        {
            "id": "1a5c7caf-fe7d-4b14-a022-91d9b52a36a0",
            "body": "Second card on cram queue",
            "projected_review_data": null,
            "categories": [
                {
                    "key": "6d18daff-94d1-489b-97ce-969d1c2912a6",
                    "title": "Grammar"
                },
                {
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary"
                }
            ],
            "cram_link": null,
            "computed_interval": 1,
            "lapses": 0,
            "reviews": 1,
            "total_reviews": 1,
            "last_reviewed": "2023-05-10",
            "introduced_on": "2023-05-10T10:06:01.179692Z",
            "review_date": "2023-05-11",
            "grade": 4,
            "easiness_factor": 2.5,
            "comment": null
        },
	{
            "id": "5b457c11-b751-436c-9cfe-f3f4d173c1ba",
            "body": "Card with cram link",
            "projected_review_data": null,
            "categories": [
                {
                    "key": "6d18daff-94d1-489b-97ce-969d1c2912a6",
                    "title": "Grammar"
                },
                {
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary"
                }
            ],
            "cram_link": "/api/users/7cfaec0a-0cc6-4249-8240-b52e40b4da7a/cards/cram-queue/5b457c11-b751-436c-9cfe-f3f4d173c1ba",
            "computed_interval": 1,
            "lapses": 0,
            "reviews": 1,
            "total_reviews": 1,
            "last_reviewed": "2023-05-10",
            "introduced_on": "2023-05-10T10:06:01.179692Z",
            "review_date": "2023-05-11",
            "grade": 4,
            "easiness_factor": 2.5,
            "comment": null
        },
    ]
};

export const cramQueueThirdPage = {
    "count": 62,
    "next": null,
    "previous": "http://localhost:8000/api/users/09ee01d5-ade6-48d5-81b8-c5be870fd0c0/cards/cram-queue/?page=2",
    "results": [
        {
            "id": "c9f2a0ec-fac1-4573-a553-26c5e8d8b5ab",
            "body": "<b><a>front</a></b>\r\n<hr />\r\n<b><i>odpowiedź</i></i>",
            "projected_review_data": null,
            "categories": [
                {
                    "key": "6d18daff-94d1-489b-97ce-969d1c2912a6",
                    "title": "Grammar"
                },
                {
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary"
                }
            ],
            "cram_link": "/api/users/7cfaec0a-0cc6-4249-8240-b52e40b4da7a/cards/cram-queue/c9f2a0ec-fac1-4573-a553-26c5e8d8b5ab",
            "computed_interval": 1,
            "lapses": 0,
            "reviews": 1,
            "total_reviews": 1,
            "last_reviewed": "2023-05-10",
            "introduced_on": "2023-05-10T10:06:01.236892Z",
            "review_date": "2023-05-13",
            "grade": 4,
            "easiness_factor": 2.5,
            "comment": null
        },
    ]
};

export const reviewSuccess = {
    "id": "7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa",
    "body": "<b>Example question on a <i>grammar</i> card.</b>\r\n<hr />\r\nExample anwer.",
    "projected_review_data": {
        "0": {
            "easiness": 1.7000000000000002,
            "interval": 1,
            "reviews": 0,
            "review_date": "2023-05-17"
        },
        "1": {
            "easiness": 1.96,
            "interval": 1,
            "reviews": 0,
            "review_date": "2023-05-18"
        },
        "2": {
            "easiness": 2.1799999999999997,
            "interval": 1,
            "reviews": 0,
            "review_date": "2023-05-19"
        },
        "3": {
            "easiness": 2.36,
            "interval": 6,
            "reviews": 2,
            "review_date": "2023-05-20"
        },
        "4": {
            "easiness": 2.5,
            "interval": 6,
            "reviews": 2,
            "review_date": "2023-05-21"
        },
        "5": {
            "easiness": 2.6,
            "interval": 6,
            "reviews": 2,
            "review_date": "2023-05-22"
        }
    },
    "categories": [
        {
            "key": "6d18daff-94d1-489b-97ce-969d1c2912a6",
            "title": "Grammar"
        },
        {
            "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
            "title": "Vocabulary"
        }
    ],
    "cram_link": null,
    "computed_interval": 1,
    "lapses": 0,
    "reviews": 1,
    "total_reviews": 1,
    "last_reviewed": "2023-05-15",
    "introduced_on": "2023-05-10T10:06:01.179692Z",
    "review_date": "2023-05-11",
    "grade": 4,
    "easiness_factor": 2.5,
    "comment": null
};

export const queuedCard = {
    "id": "5b457c11-b751-436c-9cfe-f3f4d173c1ba",
    "body": "Card without cram link",
    "projected_review_data": null,
    "categories": [
        {
            "key": "6d18daff-94d1-489b-97ce-969d1c2912a6",
            "title": "Grammar"
        },
        {
            "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
            "title": "Vocabulary"
        }
    ]
};

export const allCardsSearchResults = {
    "count": 1,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": "7d257a29-5334-4ef4-a2c9-cc9c942a108f",
            "body": "Search result",
            "projected_review_data": null,
            "categories": [
                {
                    "key": "6d18daff-94d1-489b-97ce-969d1c2912a6",
                    "title": "Grammar"
                },
                {
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary"
                }
            ],
            "cram_link": null,
            "computed_interval": 1,
            "lapses": 0,
            "reviews": 1,
            "total_reviews": 1,
            "last_reviewed": "2023-05-10",
            "introduced_on": "2023-05-10T10:06:01.179692Z",
            "review_date": "2023-05-11",
            "grade": 4,
            "easiness_factor": 2.5,
            "comment": null
        },
    ]
};

export const cardsDistribution_12Days = {
    "2023-09-15": 9,
    "2023-09-16": 9,
    "2023-09-17": 9,
    "2023-09-18": 2,
    "2023-09-19": 1,
    "2023-09-20": 7,
    "2023-09-21": 7,
    "2023-09-22": 6,
    "2023-09-23": 3,
    "2023-09-24": 3,
    "2023-09-25": 2,
    "2023-09-26": 2
};
