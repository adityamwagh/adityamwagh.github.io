---
layout: default
title: Aditya Wagh
---

<!-- Introduction -->
{% include intro.html %}

<!-- News -->
<div class="animate__animated animate__fadeIn">
    <h1 class="text-center">News</h1>
      <div class="alert rounded shadow border alert-primary" role="alert">
    <p> I am actively looking for the following <b>entry-level</b> full-time positions in the United States
    <ul>
      <li>Computer Vision Engineer</li>
      <li>Software Engineer, Perception</li>
      <li>Robotics Software Engineer</li>
      <li>Machine Learning Engineer</li>
      <li>Research Engineer</li>
    </ul>
    Reach out on <a target="_blank" href="https://www.linkedin.com/in/{{ site.data.socials.linkedin }}">LinkedIn</a>
    if you or know someone who are hiring 🙂</p>
  </div>
    <table class="rounded shadow">
        {% for entry in site.data.news %}
        <tr>
            <td class="ext-nowrap text-right"><b>{{entry.date}}</b></td>
            <td class="text-left">{{entry.event}}</td>
        </tr>
        {% endfor %}
    </table>
</div>

<!-- Projects -->
{% include projects.html %}