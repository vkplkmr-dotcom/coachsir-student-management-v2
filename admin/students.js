// Load Students
function loadStudents() {

    db.collection("qrData")
      .orderBy("studentName")
      .get()
      .then((snapshot) => {

        let html = "";

        if (snapshot.empty) {

            html = `
            <tr>
                <td colspan="7">No Students Found</td>
            </tr>
            `;

        } else {

            snapshot.forEach((doc) => {

                const d = doc.data();

                html += `
                <tr>

                    <td>${doc.id}</td>

                    <td>${d.studentName || "-"}</td>

                    <td>${d.studentClass || "-"}</td>

                    <td>${d.mobile || "-"}</td>

                    <td>${d.active ? "✅ Active" : "❌ Inactive"}</td>

                    <td>${d.expiryDate || "-"}</td>

                   <td>
    <button onclick="editStudent('${doc.id}')">✏️ Edit</button>

    <button onclick="deleteStudent('${doc.id}')">🗑️ Delete</button>
</td>

                </tr>
                `;
            });

        }

        document.getElementById("studentList").innerHTML = html;

      })

      .catch((error) => {

          document.getElementById("studentList").innerHTML =
          `
          <tr>
             <td colspan="7">
             ${error.message}
             </td>
          </tr>
          `;

      });

}

loadStudents();
let editingStudentId = null;

// Show Form
document.getElementById("addBtn").onclick = function () {

    const form = document.getElementById("studentForm");

    form.style.display =
        form.style.display === "none" ? "block" : "none";

};


// Save Student
function saveStudent() {

    const id = document.getElementById("studentId").value.trim();

    const name = document.getElementById("studentName").value.trim();

    const studentClass = document.getElementById("studentClass").value.trim();

    const mobile = document.getElementById("mobile").value.trim();

    const expiryDate = document.getElementById("expiryDate").value;

    const scanLimit = Number(document.getElementById("scanLimit").value);

    if (!id || !name) {

        alert("Student ID and Name are required.");

        return;

    }

   const docId = editingStudentId || id;

db.collection("qrData").doc(docId).set({

        studentName: name,
        studentClass: studentClass,
        mobile: mobile,
        expiryDate: expiryDate,
        scanLimit: scanLimit,
        count: 0,
        active: true,
        unlimited: false,
        createdAt: new Date()

    }).then(() => {

       alert(editingStudentId
    ? "Student Updated Successfully!"
    : "Student Added Successfully!");
        loadStudents();

    editingStudentId = null;

        document.getElementById("studentForm").style.display = "none";

    }).catch(err => {

        alert(err.message);

    });

}
function searchStudents() {

    const filter = document
        .getElementById("search")
        .value
        .toLowerCase();

    const rows = document
        .querySelectorAll("#studentList tr");

    rows.forEach(row => {

        const text = row.innerText.toLowerCase();

        row.style.display = text.includes(filter)
            ? ""
            : "none";

    });

}

// Delete Student
function deleteStudent(studentId) {

    const ok = confirm("Are you sure you want to delete this student?");

    if (!ok) return;

    db.collection("qrData")
        .doc(studentId)
        .delete()
        .then(() => {

            alert("Student Deleted Successfully!");

            loadStudents();

        })
        .catch((error) => {

            alert(error.message);

        });

}

// Edit Student
function editStudent(studentId) {

    db.collection("qrData")
      .doc(studentId)
      .get()
      .then((doc) => {

          if (!doc.exists) {
              alert("Student not found.");
              return;
          }

          const d = doc.data();

          editingStudentId = studentId;

          document.getElementById("studentForm").style.display = "block";

          document.getElementById("studentId").value = studentId;
          document.getElementById("studentName").value = d.studentName || "";
          document.getElementById("studentClass").value = d.studentClass || "";
          document.getElementById("mobile").value = d.mobile || "";
          document.getElementById("expiryDate").value = d.expiryDate || "";
          document.getElementById("scanLimit").value = d.scanLimit || 100;

      })
      .catch((error) => {

          alert(error.message);

      });

}

