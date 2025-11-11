# Development dockerfile
FROM ruby:3.4.4

ENV NODE_MAJOR=24

# https://github.com/nodesource/distributions#installation-instructions
RUN apt-get update && \
    apt-get install -y ca-certificates curl gnupg && \
    mkdir -p /etc/apt/keyrings &&  \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
    apt-get update && \
    apt-get install nodejs -y



# https://unix.stackexchange.com/a/212214/453530
RUN wget -qO- https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    pdftk \
    vim \
    htop \
    yarn

ENV APP_PATH="Sudoku"
WORKDIR /$APP_PATH

ENV PID_FOLDER="/$APP_PATH/tmp/pids"
ENV BUNDLER_VERSION=2.5.16

RUN bundle config set with development
RUN gem install bundler -v $BUNDLER_VERSION

# Remove any tmp/pids/server.pid with every container start up
COPY entrypoint.sh /$APP_PATH
RUN cp /$APP_PATH/entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

RUN mkdir /$APP_PATH/bin

CMD ["rails", "s", "-b", "0.0.0.0"]
