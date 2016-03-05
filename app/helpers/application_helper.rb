module ApplicationHelper

  def full_title(page_title = '')
    base_title = 'Sudoku'
    if page_title.empty?
      base_title
    else
      "#{page_title} | #{base_title}"
    end
  end

  def page_header(page_header = '')
    base_header = 'Sudoku'
    if page_header.empty?
      base_header
    else
      "#{page_header}"
    end
  end
end
