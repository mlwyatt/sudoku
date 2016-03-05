class String
  # This will take a string and see if it matches a date regex. If it does match,
  # it will return a new date passed off of that string. If it doesn't match anything,
  # it will return nil. The set of +options+ include returning the original string
  # +return_orig+. If +quarter+ is passed in, it will need to match "begin" or "end".
  # If it matches one of those, it will return the date object and call +beginning_of_quarter+
  # for "begin" and +end_of_quarter+ for "end".
  #
  def to_new_date(options={})
    opts = {
        :return_orig => false,
        :quarter     => nil
    }.merge(options)

    if self =~ /^\d{2}\D?\d{2}\D?\d{4}$/i # MM DD YYYY
      the_date = Date.new(
          self.scan(/\d{4}/)[0].to_i,
          self.scan(/\d{2}/)[0].to_i,
          self.scan(/\d{2}/)[1].to_i
      )

    elsif self =~ /^\d{4}\D?\d{2}\D?\d{2}$/i # YYYY MM DD
      the_date = Date.new(
          self.scan(/\d{4}/)[0].to_i,
          self.scan(/\d{2}/)[2].to_i,
          self.scan(/\d{2}/)[3].to_i
      )

    elsif self =~ /^\d{2}\D?\d{2}\D?\d{2}$/i # MM DD YY
      the_date = Date.new(
          ('20'+self.scan(/\d{2}/)[2]).to_i,
          self.scan(/\d{2}/)[0].to_i,
          self.scan(/\d{2}/)[1].to_i
      )

      #elsif self =~ /^\d{1,2}\D\d{1,2}\D\d{2,4}$/i # (M)M (D)D (YY)YY
    elsif self =~ /^(\d{1,2})[-|\/](\d{1,2})[-|\/](\d+)$/i # m d y
      numbers = /^(\d{1,2})[-|\/](\d{1,2})[-|\/](\d+)$/i.match(self)
      year = ""
      case numbers[3].length
        when 2
          year = "20#{numbers[3]}".to_i
        when 4
          year = numbers[3].to_i
        else
          return opts[:return_orig].to_s.to_bool ? self : nil
      end

      the_date = Date.new(year, numbers[1].to_i, numbers[2].to_i)
    else
      return opts[:return_orig].to_s.to_bool ? self : nil
    end

    if opts[:quarter].present? && /begin/i =~ opts[:quarter].to_s
      the_date.beginning_of_quarter
    elsif opts[:quarter].present? && /end/i =~ opts[:quarter].to_s
      the_date.end_of_quarter
    else
      the_date
    end
  rescue => e
    _write_to_log("To new date --> #{Time.zone.now.strftime("%Y-%m-%d %H:%M")}\n\t#{e.class}::#{e.message}\n")
    raise(e)
  end
end