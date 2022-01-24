# Building Scalable APIs with GraphQL
https://app.pluralsight.com/library/courses/graphql-scalable-apis/discussion
https://app.pluralsight.com/course-player?clipId=540cc1c3-650f-4336-9987-d3fad8c59992
https://github.com/jscomplete/name-contests

# See m3-02 part to init data

####
# Query
{
  user(key: "4242") {
    id
    fullName
    email
    createdAt
    contests {
      id
      code
      title
      description
      status
      createdAt
      names {
        label
        createdBy {
          fullName
        }
        totalVotes {
          up
          down
        }
      }
    }
    contestsCount
    namesCount
    votesCount
  }
}
####
mutation AddNewContest($input: ContestInputType!) {
  AddContest(input: $input) {
    id
    code
    title
    description
    status
  }
}


{
  "input": 
  {
    "apiKey": "0000",
    "title": "New graphQL course",
    "description": "blablabla ...."
  }
}
####
mutation PorposeName($input: NameInput!) {
  AddName(input: $input) {
    id
    label
    description
    totalVotes {
      up
      down
    }
  }
}

{
  "input": {
    "apiKey": "0000",
    "contestId": "5",
    "label": "last test",
    "description": "..."
  }
}