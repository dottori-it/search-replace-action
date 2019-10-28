# GitHub Action - Search and replace

A GitHub action to search and replace from string and file.

Input parameters:

  - search-value (required): The value that will be replaced by the new value
  - new-value (required): The value to replace the search value with
  - subject: The string to be searched and replaced. If omitted subject-paht is required. If both subject and subject-path are provided, subject takes precedence.
  - subject-path: The text file path which content we wanto to be searcehd and replaced. If omitted subject is required. If both subject and subject-path are provided, subject takes precedence.

Outputs:
  - new-subject: If subject-path is provided, the path of searched and replaced file, otherwise the subject with search-value replaced by new-value.
