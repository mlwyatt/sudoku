class Cell < ActiveRecord::Base
  before_save :single_note_value
  serialize :notes, Array

  private

  def single_note_value
    if self.notes.size == 1
      self.value = self.notes[0].to_i
      self.notes = nil
    end
  end
end
