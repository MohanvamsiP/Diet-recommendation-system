FROM ubuntu

RUN apt update -y \ 
&& apt install python3 -y \
&& apt install wget -y \
&& apt install python3-pip -y \
&& pip3 install streamlit==0.89.0 pillow==7.0.0 google-cloud==0.32 pandas==1.3.3 requests==2.22.0

WORKDIR /usr/share/app/vision

COPY . .

EXPOSE 8501

CMD ["python3","-m","streamlit","run","test.py"]

