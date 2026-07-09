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
                        <button>Edit</button>
                        <button>Delete</button>
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

    db.collection("qrData").doc(id).set({

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

        alert("Student Added Successfully!");

        loadStudents();

        document.getElementById("studentForm").style.display = "none";

    }).catch(err => {

        alert(err.message);

    });

}
